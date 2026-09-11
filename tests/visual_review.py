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
import shutil
import subprocess
import time
import urllib.request
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(os.environ.get('REVIEW_OUTPUT', str(ROOT / 'artifacts/review')))
OUT.mkdir(parents=True, exist_ok=True)
INLINE = os.environ.get('INLINE_REVIEW_TEMPLATE')
TEMPLATE = Path(INLINE).read_text() if INLINE else None
BASE = os.environ.get('REVIEW_BASE_URL', 'http://127.0.0.1:4173')
ROUTES = ['/', '/about', '/projects', '/awards', '/activities', '/members', '/resources', '/join', '/projects/esp32-homepilot', '/activities/stm32-workshop', '/not-found']
report = {'mode': 'component fixture' if INLINE else 'production build', 'screenshots': [], 'checks': [], 'errors': [], 'limitations': ['Native browser routing and storage are excluded from the component fixture.'] if INLINE else []}
server = None

def check(name, condition):
    if not condition:
        raise AssertionError(name)
    report['checks'].append(name)

def load(page, route):
    if TEMPLATE:
        if page.evaluate('typeof window.__reviewNavigate === "function"'):
            page.evaluate('(route) => window.__reviewNavigate(route)', route)
        else:
            page.set_content(TEMPLATE.replace('__INITIAL_ROUTE__', json.dumps(route)), wait_until='load')
    else:
        page.goto(BASE + route, wait_until='networkidle')
    page.locator('h1').first.wait_for()
    page.evaluate('document.fonts.ready')
    # Force lazy images to load in the capture only; production stays lazy.
    page.evaluate('document.querySelectorAll("img[loading=lazy]").forEach(img => img.loading = "eager")')
    page.wait_for_function('Array.from(document.images).every(img => img.complete)', timeout=10000)
    page.evaluate('window.scrollTo(0, 0)')
    page.wait_for_timeout(100)

try:
    if not INLINE:
        server = subprocess.Popen(['npm', 'run', 'preview', '--', '--host', '127.0.0.1', '--port', '4173'], cwd=ROOT, stdout=open(OUT/'preview.log', 'w'), stderr=subprocess.STDOUT)
        for attempt in range(90):
            try:
                urllib.request.urlopen(BASE, timeout=1)
                break
            except Exception:
                time.sleep(.5)
        else:
            raise RuntimeError('Production preview did not start')
    with sync_playwright() as p:
        executable = os.environ.get('BROWSER_EXECUTABLE')
        browser = p.chromium.launch(**({'executable_path': executable} if executable else {}), headless=True, args=['--no-sandbox'])
        for width, height, label in [(1440,1000,'desktop'), (390,844,'mobile')]:
            for route in ROUTES:
                context = browser.new_context(viewport={'width':width, 'height':height}, device_scale_factor=1, locale='zh-CN', reduced_motion='reduce')
                page = context.new_page()
                errors=[]
                page.on('pageerror', lambda error: errors.append(str(error)))
                page.on('console', lambda message: errors.append(message.text) if message.type == 'error' else None)
                load(page,route)
                check(f'{label} {route}: exactly one h1', page.locator('h1').count() == 1)
                check(f'{label} {route}: no horizontal overflow', page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
                check(f'{label} {route}: images loaded', page.evaluate('Array.from(document.images).every(img => img.complete && img.naturalWidth > 0)'))
                check(f'{label} {route}: no browser errors', not errors)
                slug = route.strip('/').replace('/','-') or 'home'
                name = f'{label}-{slug}.png'
                page.screenshot(path=str(OUT/name), full_page=True, animations='disabled')
                report['screenshots'].append({'route':route,'width':width,'height':height,'file':name})
                context.close()
        context = browser.new_context(viewport={'width':1440,'height':1000}, locale='zh-CN', reduced_motion='reduce')
        page = context.new_page()
        load(page,'/projects')
        page.get_by_role('button',name='物联网',exact=True).click()
        check('project category filters',page.locator('.project-card').count()==1)
        page.locator('input[type=search]').fill('nonexistent-test-999')
        check('project empty search state',page.locator('.empty-state').count()==1)
        page.get_by_role('button',name='查看全部内容',exact=True).click()
        check('project reset restores all cards',page.locator('.project-card').count()==3)
        page.locator('input[type=search]').fill('stm32')
        check('project search is case insensitive',page.locator('.project-card').count()==1)
        load(page,'/resources')
        page.locator('input[type=search]').fill('MQTT')
        check('resource search works',page.locator('.resource-card').count()==1)
        page.get_by_role('button',name='清空搜索',exact=True).click()
        page.get_by_role('button',name='单片机',exact=True).click()
        check('resource categories work',page.locator('.resource-card').count()==2)
        check('resource links are real external links',page.locator('.resource-card').evaluate_all("links => links.every(a => a.href.startsWith('https://') && a.target === '_blank' && a.rel.includes('noopener'))"))
        load(page,'/awards')
        page.get_by_role('button',name='国家级',exact=True).click()
        check('award filtering works',page.locator('.award-card').count()==1)
        check('awards remain labeled examples', '示例' in page.locator('.award-card').inner_text())
        load(page,'/members')
        page.get_by_role('button',name='历届成员',exact=True).click()
        check('unfilled member group has honest empty state',page.locator('.empty-state').count()==1)
        load(page,'/join')
        first=page.locator('details').first
        first.locator('summary').click()
        check('FAQ opens',first.get_attribute('open') is not None)
        first.locator('summary').click()
        check('FAQ closes',first.get_attribute('open') is None)
        check('missing signup cannot collect data',page.get_by_role('button',name='招新入口暂未开放').is_disabled())
        check('no fake submission form',page.locator('form').count()==0)
        load(page,'/')
        page.get_by_role('button',name='切换深色模式').click()
        check('dark mode changes theme',page.locator('html').get_attribute('data-theme')=='dark')
        page.screenshot(path=str(OUT/'desktop-home-dark.png'),full_page=True)
        if not INLINE:
            page.reload(wait_until='networkidle')
            check('dark mode persists across reloads',page.locator('html').get_attribute('data-theme')=='dark')
            page.get_by_role('button',name='切换浅色模式').click()
            page.get_by_role('link',name='查看项目',exact=True).click()
            check('native history navigation',page.url.endswith('/projects'))
            page.go_back(wait_until='networkidle')
            check('native back returns home',page.url.endswith('/'))
            page.goto(BASE+'/projects/edge-vision',wait_until='networkidle')
            page.reload(wait_until='networkidle')
            check('deep-link refresh',page.locator('h1').inner_text()=='EdgeSight 边缘视觉平台')
            page.goto(BASE+'/resources?category=单片机',wait_until='networkidle')
            check('category deep link selects MCU resources',page.locator('.resource-card').count()==2)
            page.evaluate("history.pushState(null, '', '/resources?category=人工智能');dispatchEvent(new PopStateEvent('popstate'))")
            page.wait_for_function("document.querySelector('.resource-card h2')?.textContent.includes('OpenCV')")
            check('query-only navigation updates resource category',page.locator('.resource-card').count()==2)
            page.go_back(wait_until='networkidle')
            page.wait_for_function("document.querySelector('.resource-card h2')?.textContent.includes('STM32')")
            check('browser back restores query category',page.locator('.resource-card').count()==2)
            page.goto(BASE+'/activities/hardware-night',wait_until='networkidle')
            page.locator('.activity-art img').evaluate("img => img.src='/intentionally-missing-test-image.webp'")
            page.locator('.activity-art svg').wait_for()
            check('missing activity photo falls back without broken image',page.locator('.activity-art img').count()==0)
        page.set_viewport_size({'width':390,'height':844})
        load(page,'/projects/esp32-homepilot')
        check('mobile system diagram is a continuous vertical flow',page.locator('.system-flow').evaluate("el => getComputedStyle(el).flexDirection === 'column'"))
        load(page,'/')
        page.get_by_role('button',name='打开导航菜单').click()
        check('mobile dialog opens',page.locator('dialog').is_visible())
        check('mobile dialog locks background scroll',page.evaluate('document.body.style.overflow')=='hidden')
        page.screenshot(path=str(OUT/'mobile-navigation.png'))
        page.keyboard.press('Escape')
        check('Escape closes mobile dialog',not page.locator('dialog').is_visible())
        check('closing dialog restores scrolling',page.evaluate('document.body.style.overflow')!='hidden')
        page.get_by_role('button',name='打开导航菜单').click()
        page.locator('dialog a[href="/projects"]').click()
        page.locator('.project-grid').wait_for()
        check('mobile navigation changes the page',page.locator('.collection-page').count()==1)
        check('mobile navigation closes dialog',not page.locator('dialog').is_visible())
        context.close()
        # Probe breakpoints in fresh contexts; avoid fixture unmount residue.
        for width in [360,768,1024,1920]:
            for route in ROUTES[:8]:
                context=browser.new_context(viewport={'width':width,'height':1000},locale='zh-CN',reduced_motion='reduce')
                page=context.new_page()
                load(page,route)
                check(f'{width}px {route}: no overflow',page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
                context.close()
        browser.close()
except Exception as e:
    report['errors'].append(str(e))
    raise
finally:
    (OUT/'results.json').write_text(json.dumps(report,ensure_ascii=False,indent=2))
    if server: server.terminate()
    print(json.dumps({'mode':report['mode'],'checks':len(report['checks']),'screenshots':len(report['screenshots']),'errors':report['errors']},ensure_ascii=False))
