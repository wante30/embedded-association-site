"""Browser checks and screenshots. Normal mode tests the real production build.

npm run build
python -m pip install playwright
python -m playwright install chromium
python tests/visual_review.py

INLINE_REVIEW_TEMPLATE is only a supplementary component fixture for restricted
review environments: it excludes native routing and persistent browser storage.
"""
from pathlib import Path
import json
import os
import threading
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlsplit
from playwright.sync_api import sync_playwright
from certificate_review import review_certificates
from motion_review import review_motion
from home_review import review_home
from competitions_review import review_competitions

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('REVIEW_OUTPUT', str(ROOT / 'artifacts/review')))
OUT.mkdir(parents=True, exist_ok=True)
INLINE = os.environ.get('INLINE_REVIEW_TEMPLATE')
TEMPLATE = Path(INLINE).read_text(encoding='utf-8') if INLINE else None
BASE_OVERRIDE = os.environ.get('REVIEW_BASE_URL')
BASE_PATH = '/' + os.environ.get('REVIEW_BASE_PATH', '/').strip('/')
BASE = (BASE_OVERRIDE or '').rstrip('/')
CONTENT = json.loads((ROOT / 'src/content/site.json').read_text(encoding='utf-8'))
MAIN_ROUTES = list(json.loads((ROOT / 'src/content/routes.json').read_text(encoding='utf-8')))
ROUTES = MAIN_ROUTES + [f'/projects/{p["id"]}' for p in CONTENT['projects']] + [f'/activities/{a["id"]}' for a in CONTENT['activities']] + ['/not-found']
report = {'mode': 'component fixture' if INLINE else 'deployed site' if BASE_OVERRIDE else 'production build', 'screenshots': [], 'checks': [], 'errors': [], 'limitations': ['Native browser routing and storage are excluded from the component fixture.'] if INLINE else []}
server = None

class StaticPreview(SimpleHTTPRequestHandler):
    """Serve dist under a prefix, without Vite's implicit SPA 200 fallback."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT / 'dist'), **kwargs)

    def translate_path(self, path):
        if BASE_PATH != '/':
            pathname = urlsplit(path).path
            if pathname != BASE_PATH and not pathname.startswith(BASE_PATH + '/'):
                return str(ROOT / 'dist/__outside_deployment__')
            path = path[len(BASE_PATH):] or '/'
        return super().translate_path(path)

    def send_error(self, code, message=None, explain=None):
        if code != 404:
            return super().send_error(code, message, explain)
        html = (ROOT / 'dist/404.html').read_bytes()
        self.send_response(404)
        self.send_header('Content-Type', 'text/html; charset=utf-8')
        self.send_header('Content-Length', str(len(html)))
        self.end_headers()
        if self.command != 'HEAD':
            self.wfile.write(html)

    def log_message(self, *args):
        pass

def check(name, condition):
    if not condition:
        raise AssertionError(name)
    report['checks'].append(name)

def check_touch_targets(name, locator):
    targets = locator.evaluate_all('''elements => elements.map(el => {
        const rect = el.getBoundingClientRect();
        return {name: el.getAttribute('aria-label') || el.textContent.trim(), width: rect.width, height: rect.height};
    }).filter(rect => rect.width > 0 && rect.height > 0)''')
    undersized = [target for target in targets if target['width'] < 44 or target['height'] < 44]
    check(f'{name}: primary touch targets are at least 44px' + (f' {undersized}' if undersized else ''), bool(targets) and not undersized)

def load(page, route):
    if TEMPLATE:
        if page.evaluate('typeof window.__reviewNavigate === "function"'):
            page.evaluate('(route) => window.__reviewNavigate(route)', route)
        else:
            page.set_content(TEMPLATE.replace('__INITIAL_ROUTE__', json.dumps(route)), wait_until='load')
    else:
        response = page.goto(BASE + route, wait_until='networkidle')
        check(f'{route}: HTTP status', response.status == (404 if route == '/not-found' else 200))
        if route != '/not-found':
            response = page.reload(wait_until='networkidle')
            check(f'{route}: reload HTTP 200', response.status == 200)
    page.locator('h1').first.wait_for()
    page.evaluate('document.fonts.ready')
    # Force lazy images to load in the capture only; production stays lazy.
    page.evaluate('document.querySelectorAll("img[loading=lazy]").forEach(img => img.loading = "eager")')
    page.wait_for_function('Array.from(document.images).every(img => img.complete)', timeout=10000)
    page.evaluate('window.scrollTo(0, 0)')
    page.wait_for_timeout(100)

try:
    if not INLINE and not BASE_OVERRIDE:
        if not (ROOT / 'dist/404.html').exists():
            raise RuntimeError('Run npm run build before the browser review')
        server = ThreadingHTTPServer(('127.0.0.1', int(os.environ.get('REVIEW_PORT', '0'))), StaticPreview)
        worker = threading.Thread(target=server.serve_forever, daemon=True)
        worker.start()
        BASE = f'http://127.0.0.1:{server.server_port}' + BASE_PATH.rstrip('/')
    report['base_url'] = BASE
    with sync_playwright() as p:
        executable = os.environ.get('BROWSER_EXECUTABLE')
        browser = p.chromium.launch(**({'executable_path': executable} if executable else {}), headless=True, args=['--no-sandbox'])
        for width, height, label in [(1440,1000,'desktop'), (390,844,'mobile')]:
            for route in ROUTES:
                context = browser.new_context(viewport={'width':width, 'height':height}, device_scale_factor=1, locale='zh-CN', reduced_motion='reduce')
                page = context.new_page()
                errors=[]
                page.on('pageerror', lambda error: errors.append(str(error)))
                page.on('console', lambda message: errors.append(message.text) if message.type == 'error' and not (route == '/not-found' and '404' in message.text) else None)
                page.on('response', lambda response: errors.append(f'{response.status} {response.url}') if response.status >= 400 and not (route == '/not-found' and response.request.resource_type == 'document') else None)
                load(page,route)
                check(f'{label} {route}: exactly one h1', page.locator('h1').count() == 1)
                check(f'{label} {route}: no stale demo labels', not any(label in page.locator('main').inner_text() for label in ['概念示例', '概念展示', '待核实', '展示示例']))
                check(f'{label} {route}: no horizontal overflow', page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
                check(f'{label} {route}: images loaded', page.evaluate('Array.from(document.images).every(img => img.complete && img.naturalWidth > 0)'))
                check(f'{label} {route}: images decode', page.evaluate('async () => (await Promise.all(Array.from(document.images, img => img.decode().then(() => true, () => false)))).every(Boolean)'))
                displayed_projects = CONTENT['projects'] if route == '/projects' else []
                expected = [project['image'] for project in displayed_projects if project['image']]
                expected += [a['image'] for a in CONTENT['activities'] if a['image']] if route in ['/', '/activities'] else []
                expected += [entry['image'] for group in ['projects', 'activities'] for entry in CONTENT[group] if route == f'/{group}/{entry["id"]}' and entry['image']]
                if route == '/about':
                    expected.append('/images/association-group-2024.jpg')
                actual = page.locator('img').evaluate_all('images => images.map(img => img.currentSrc)')
                check(f'{label} {route}: real images have no silent fallback', all(BASE + src in actual for src in expected) if not INLINE else True)
                if not INLINE:
                    prefix = urlsplit(BASE).path.rstrip('/') + '/'
                    check(f'{label} {route}: images and internal links stay under deployment prefix', page.locator('img, a[href]').evaluate_all('(elements, prefix) => elements.every(el => { const url = new URL(el.currentSrc || el.href); return url.origin !== location.origin || url.pathname.startsWith(prefix); })', prefix))
                if route == '/':
                    check(f'{label}: hero background decodes', page.locator('.hero-photo img').evaluate('async img => { try { await img.decode(); return img.naturalWidth > 0; } catch { return false; } }'))
                if route in ['/', '/about']:
                    preview = page.get_by_role('region', name='竞赛荣誉', exact=True)
                    published = [award for award in CONTENT['awards'] if not award['example']]
                    cards = preview.locator('.award-preview-card')
                    check(f'{label} {route}: representative awards follow published records', cards.count() == min(3, len(published)) and all(
                        all(value in cards.nth(i).inner_text() for value in [award['year'], award['level'], award['name'], award['award'], award['team']])
                        for i, award in enumerate(published[:3])))
                    check(f'{label} {route}: award totals are current', preview.locator('.awards-preview__heading p').inner_text() == f"已公开 {len(published)} 项竞赛记录，其中 {sum(award['level']=='国家级' for award in published)} 项国家级记录。")
                    check(f'{label} {route}: award preview omits advisor information', '指导教师' not in preview.inner_text())
                check(f'{label} {route}: no browser errors', not errors)
                slug = route.strip('/').replace('/','-') or 'home'
                name = f'{label}-{slug}.png'
                page.screenshot(path=str(OUT/name), full_page=True, animations='disabled')
                report['screenshots'].append({'route':route,'width':width,'height':height,'file':name})
                context.close()
            print(f'{label}: {len(ROUTES)} routes captured', flush=True)
        context = browser.new_context(viewport={'width':1440,'height':1000}, locale='zh-CN', reduced_motion='reduce')
        page = context.new_page()
        load(page,'/projects')
        page.get_by_role('button',name='物联网',exact=True).click()
        check('project category filters',page.locator('.project-card').count()==3)
        page.locator('input[type=search]').fill('nonexistent-test-999')
        check('project empty search state',page.locator('.empty-state').count()==1)
        page.get_by_role('button',name='查看全部内容',exact=True).click()
        check('project reset restores all cards',page.locator('.project-card').count()==3)
        page.locator('input[type=search]').fill('慧枢')
        check('project search finds the featured real project',page.locator('.project-card').count()==1)
        load(page,'/')
        check('home states the integrated-circuit audience', '集成电路专业' in page.locator('.hero-description').inner_text())
        page.locator('.direction-card').filter(has_text='FPGA 与数字电路').click()
        check('FPGA direction opens its resource category', 'category=FPGA' in urlsplit(page.url).query and page.locator('.resource-card').count()==4)
        if not INLINE:
            response=page.reload(wait_until='networkidle')
            check('FPGA category survives deep-link refresh', response.status==200 and page.get_by_role('button',name='FPGA',exact=True).get_attribute('aria-pressed')=='true' and page.locator('.resource-card').count()==4)
        load(page,'/resources')
        for label, key in [('FPGA 学习路线','fpgaLearningPaths'), ('单片机与嵌入式学习路线','learningPaths')]:
            roadmap=page.get_by_role('list',name=label,exact=True)
            check(f'{label}: follows the content source', roadmap.locator('strong').all_text_contents()==[step['title'] for step in CONTENT[key]])
            check(f'{label}: includes the published topics', roadmap.locator('p').all_text_contents()==[step['topics'] for step in CONTENT[key]])
        page.get_by_role('button',name='FPGA',exact=True).click()
        page.get_by_role('searchbox').fill('时序')
        check('FPGA resource search finds timing constraints', page.locator('.resource-card').count()==1 and 'UG903' in page.locator('.resource-card').inner_text())
        page.get_by_role('button',name='清空搜索',exact=True).click()
        page.get_by_role('button',name='全部',exact=True).click()
        page.locator('input[type=search]').fill('MQTT')
        check('resource search works',page.locator('.resource-card').count()==1)
        page.get_by_role('button',name='清空搜索',exact=True).click()
        page.get_by_role('button',name='单片机',exact=True).click()
        check('resource categories work',page.locator('.resource-card').count()==2)
        check('resource links are real external links',page.locator('.resource-card').evaluate_all("links => links.every(a => a.href.startsWith('https://') && a.target === '_blank' && a.rel.includes('noopener'))"))
        load(page,'/awards')
        page.get_by_role('button',name='国家级',exact=True).click()
        check('award filtering works',page.locator('.award-card').count()==sum(award['level']=='国家级' for award in CONTENT['awards']))
        check('wall and text archive share the level filter',page.locator('.certificate-wall__item').count()==page.locator('.award-card').count())
        check('awards omit advisor information', '指导教师' not in page.locator('main').inner_text())
        check('published awards contain no placeholder labels', '待核实' not in page.locator('.awards-timeline').inner_text() and '示例' not in page.locator('.awards-timeline').inner_text())
        page.get_by_role('button',name='全部',exact=True).click()
        page.get_by_role('searchbox').fill('蔡永胜')
        check('award search finds both stages for a member', page.locator('.award-card').count()==2)
        check('wall and text archive share search results',page.locator('.certificate-wall__item').count()==2)
        page.get_by_role('button',name='校级',exact=True).click()
        check('award search and level filter combine', page.locator('.empty-state').count()==1)
        page.get_by_role('button',name='查看全部内容',exact=True).click()
        check('award empty state restores all records', page.locator('.award-card').count()==len(CONTENT['awards']))
        page.get_by_role('button',name='校级',exact=True).click()
        check('campus awards retain their own level', page.locator('.award-card').count()==1 and '王承粲' in page.locator('.award-card').inner_text())
        if not INLINE:
            review_certificates(page, BASE, CONTENT, OUT, check, check_touch_targets, 'desktop', all_records=True)
        load(page,'/members')
        page.get_by_role('button',name='学生管理员',exact=True).click()
        check('student manager filter shows confirmed public records',page.locator('.member-card').count()==3)
        load(page,'/join')
        first=page.locator('details').first
        first.locator('summary').click()
        check('FAQ opens',first.get_attribute('open') is not None)
        first.locator('summary').click()
        check('FAQ closes',first.get_attribute('open') is None)
        qr=page.locator('.join-qr img')
        check('join page shows the association group QR',qr.count()==1 and qr.evaluate('img => img.complete && img.naturalWidth > 0'))
        check('join group QR renders large enough to scan',qr.evaluate('img => img.getBoundingClientRect().width')>=140)
        check('group QR states its validity window','有效期至' in page.locator('.join-qr').inner_text())
        check('no fake submission form',page.locator('form').count()==0)
        check('join page collects no personal data',page.locator('form input, form textarea, input[type=email], input[type=tel]').count()==0)
        for project in CONTENT['projects']:
            load(page,'/')
            entry = page.locator(f'main a[href$="/projects/{project["id"]}"]').first
            check(f'home: {project["name"]} has a project entry', entry.count() == 1 and entry.is_visible())
            entry.click()
            page.get_by_role('heading',name=project['name'],exact=True).wait_for()
            check(f'home: {project["name"]} entry opens its detail', page.locator('h1').inner_text() == project['name'])
        load(page,'/')
        page.get_by_role('button',name='切换深色模式').click()
        check('dark mode changes theme',page.locator('html').get_attribute('data-theme')=='dark')
        page.screenshot(path=str(OUT/'desktop-home-dark.png'),full_page=True)
        if not INLINE:
            page.reload(wait_until='networkidle')
            check('dark mode persists across reloads',page.locator('html').get_attribute('data-theme')=='dark')
            page.get_by_role('button',name='切换浅色模式').click()
            page.get_by_role('navigation',name='主导航',exact=True).get_by_role('link',name='项目',exact=True).click()
            check('native history navigation',page.url.endswith('/projects'))
            page.go_back(wait_until='networkidle')
            check('native back returns home',page.url.endswith('/'))
            page.goto(BASE+'/projects/huishu-2026',wait_until='networkidle')
            page.reload(wait_until='networkidle')
            check('deep-link refresh',page.locator('h1').inner_text()=='慧枢——多模态居家养老协同系统')
            page.goto(BASE+'/resources?category=单片机',wait_until='networkidle')
            check('category deep link selects MCU resources',page.locator('.resource-card').count()==2)
            page.evaluate("url => { history.pushState(null, '', url); dispatchEvent(new PopStateEvent('popstate')); }", BASE + '/resources?category=人工智能')
            page.wait_for_function("document.querySelector('.resource-card h2')?.textContent.includes('OpenCV')")
            check('query-only navigation updates resource category',page.locator('.resource-card').count()==2)
            page.go_back(wait_until='networkidle')
            page.wait_for_function("document.querySelector('.resource-card h2')?.textContent.includes('STM32')")
            check('browser back restores query category',page.locator('.resource-card').count()==2)
            page.goto(BASE+'/activities/autumn-training-2024',wait_until='networkidle')
            page.locator('.activity-art img').evaluate("(img, url) => img.src=url", BASE + '/intentionally-missing-test-image.webp')
            page.locator('.media-unavailable').wait_for()
            check('missing real activity photo is explicitly unavailable',page.locator('.activity-art img').count()==0 and page.locator('.activity-art svg').count()==0)
            load(page,'/projects/huishu-2026')
            page.locator('.detail-visual img').evaluate('(img, url) => img.src=url', BASE + '/intentionally-missing-project-image.webp')
            page.locator('.detail-visual .media-unavailable').wait_for()
            check('missing real project image never becomes a concept SVG', page.locator('.detail-visual img, .detail-visual svg.project-art').count()==0)
        context.close()
        for width, height in [(320,568), (390,844)]:
            context = browser.new_context(viewport={'width':width,'height':height}, device_scale_factor=1, is_mobile=True, has_touch=True, locale='zh-CN', reduced_motion='reduce')
            page = context.new_page()
            label = f'touch {width}px'
            load(page,'/')
            check_touch_targets(f'{label} header', page.locator('.site-header button'))
            check_touch_targets(f'{label} hero', page.locator('.hero-actions a'))
            if not INLINE:
                review_certificates(page, BASE, CONTENT, OUT, check, check_touch_targets, f'touch-{width}')
                load(page, '/')
            page.locator('.hero-actions').get_by_role('link', name='了解协会', exact=True).tap()
            check(f'{label}: home hero opens the association introduction', page.locator('.about-actions').count() == 1)
            load(page, '/')
            page.locator('.hero-actions').get_by_role('link', name='学习资源', exact=True).tap()
            check(f'{label}: home hero opens learning resources', page.get_by_role('list', name='FPGA 学习路线', exact=True).count() == 1)
            load(page, '/')
            honors_wall = page.locator('.home-certificate-preview')
            honors_wall.tap()
            check(f'{label}: bottom home collage opens the certificate wall', page.locator('.certificate-wall__item').count() == len(CONTENT['awards']))
            load(page, '/about')
            check_touch_targets(f'{label} about introduction', page.locator('.about-actions a'))
            page.locator('.about-actions').get_by_role('link', name='查看竞赛荣誉', exact=True).tap()
            check(f'{label}: about introduction opens all awards without the menu', page.locator('.award-card').count() == len(CONTENT['awards']))
            for route in ['/', '/about']:
                load(page, route)
                preview = page.get_by_role('region', name='竞赛荣誉', exact=True)
                check_touch_targets(f'{label} {route} award preview', preview.get_by_role('link', name='查看全部荣誉', exact=True))
                preview.get_by_role('link', name='查看全部荣誉', exact=True).tap()
                check(f'{label} {route}: preview opens the complete records', page.locator('.award-card').count() == len(CONTENT['awards']))
            load(page, '/')
            check(f'{label}: circuit photo has clear space in the first viewport', page.locator('.hero-visual').evaluate('''visual => {
                const hero = document.querySelector('.home-hero').getBoundingClientRect();
                const actions = document.querySelector('.hero-actions').getBoundingClientRect();
                return Math.min(hero.bottom, innerHeight) - actions.bottom >= 90
                    && visual.getBoundingClientRect().width >= innerWidth;
            }'''))
            name = f'mobile-{width}-home-viewport.png'
            page.screenshot(path=str(OUT/name), animations='disabled')
            report['screenshots'].append({'route':'/','width':width,'height':height,'file':name})
            page.locator('.hero-visual').scroll_into_view_if_needed()
            name = f'mobile-{width}-circuit.png'
            page.screenshot(path=str(OUT/name), animations='disabled')
            report['screenshots'].append({'route':'/','width':width,'height':height,'file':name})
            page.evaluate('window.scrollTo(0, 0)')
            menu = page.get_by_role('button',name='打开导航菜单')
            menu.tap()
            dialog = page.get_by_role('dialog',name='网站导航')
            check(f'{label}: mobile dialog opens', dialog.is_visible())
            check_touch_targets(f'{label} navigation', dialog.locator('a, button'))
            scroll_before = page.evaluate('scrollY')
            page.mouse.move(2, height // 2)
            page.mouse.wheel(0, 400)
            page.wait_for_timeout(150)
            check(f'{label}: mobile dialog locks background scroll', page.evaluate('scrollY') == scroll_before)
            name = f'mobile-{width}-navigation.png'
            page.screenshot(path=str(OUT/name), animations='disabled')
            report['screenshots'].append({'route':'/','width':width,'height':height,'file':name})
            page.keyboard.press('Escape')
            check(f'{label}: Escape closes mobile dialog', not dialog.is_visible())
            check(f'{label}: Escape restores menu focus', menu.evaluate('el => el === document.activeElement'))
            page.mouse.wheel(0, 400)
            page.wait_for_function('(previous) => scrollY > previous', arg=scroll_before)
            check(f'{label}: closing dialog restores scrolling', page.evaluate('scrollY') > scroll_before)
            menu.tap()
            page.get_by_role('button',name='关闭导航菜单').tap()
            check(f'{label}: close button closes mobile dialog', not dialog.is_visible())
            check(f'{label}: close button restores menu focus', menu.evaluate('el => el === document.activeElement'))
            menu.tap()
            dialog.locator('a[href$="/join"]').tap()
            page.locator('h1').wait_for()
            check(f'{label}: final navigation item is reachable', page.url.endswith('/join') and page.locator('.join-qr img').count()==1)
            check(f'{label}: navigation closes the dialog', not dialog.is_visible())
            menu.tap()
            dialog.locator('a[href$="/projects"]').tap()
            page.locator('.project-grid').wait_for()
            check(f'{label}: mobile navigation changes the page', page.locator('.collection-page').count() == 1)
            check(f'{label}: project navigation closes the dialog', not dialog.is_visible())
            for route in ['/projects', '/resources', '/activities', '/awards', '/members']:
                load(page, route)
                check_touch_targets(f'{label} {route} filters', page.get_by_role('group',name='分类筛选').get_by_role('button'))
                search = page.get_by_role('searchbox')
                if search.count():
                    check(f'{label} {route}: search text is at least 16px', search.evaluate('el => parseFloat(getComputedStyle(el).fontSize) >= 16'))
                    search.fill('test')
                    clear = page.get_by_role('button',name='清空搜索')
                    check_touch_targets(f'{label} {route} search clear', clear)
                    clear.tap()
                    check(f'{label} {route}: search clear works by touch', search.input_value() == '')
            load(page, '/projects/huishu-2026')
            nodes = page.locator('.system-flow > *')
            architecture = CONTENT['projects'][0]['architecture']
            check(f'{label}: system groups retain all published content in order', nodes.count() == len(architecture) and all(expected in actual for expected, actual in zip(architecture, nodes.all_text_contents())))
            check(f'{label}: system groups fit without overlapping', nodes.evaluate_all('''nodes => {
                const rects = nodes.map(node => node.getBoundingClientRect());
                return rects.every(rect => rect.width > 0 && rect.height > 0 && rect.left >= 0 && rect.right <= innerWidth)
                    && rects.every((rect, i) => rects.slice(i + 1).every(other =>
                        rect.right <= other.left || other.right <= rect.left || rect.bottom <= other.top || other.bottom <= rect.top));
            }'''))
            context.close()
        # Probe breakpoints in fresh contexts; avoid fixture unmount residue.
        for width in [320,360,768,1024,1920]:
            for route in ROUTES[:-1]:
                context=browser.new_context(viewport={'width':width,'height':1000},locale='zh-CN',reduced_motion='reduce')
                page=context.new_page()
                load(page,route)
                check(f'{width}px {route}: no overflow',page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
                context.close()
            print(f'{width}px: all public routes fit', flush=True)
        if not INLINE:
            review_home(browser, BASE, CONTENT, OUT, check)
            review_competitions(browser, BASE, CONTENT, OUT, check)
            review_motion(browser, BASE, check)
        browser.close()
except Exception as e:
    report['errors'].append(str(e))
    raise
finally:
    (OUT/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2), encoding='utf-8')
    if server:
        server.shutdown()
        server.server_close()
        worker.join(timeout=5)
    print(json.dumps({'mode':report['mode'],'checks':len(report['checks']),'screenshots':len(report['screenshots']),'errors':report['errors']},ensure_ascii=False))
