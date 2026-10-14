"""Association-first homepage, responsive circuit imagery, and final honors entry."""
from io import BytesIO
from PIL import Image, ImageStat


def review_home(browser, base, content, out, check):
    for width, height, dark, dpr in [(320,568,False,1), (360,640,False,1), (390,844,False,1), (430,932,False,1), (768,1024,False,1), (1440,1000,False,1), (390,844,True,1), (1440,1000,True,1), (390,844,False,2)]:
        label = f'home {width}px {"dark" if dark else "light"} {dpr}x'
        context = browser.new_context(viewport={'width':width,'height':height}, device_scale_factor=dpr, is_mobile=width < 768, has_touch=width < 768, locale='zh-CN', reduced_motion='reduce')
        if dark:
            context.add_init_script('localStorage.setItem("association-theme","dark")')
        page = context.new_page()
        errors, full_certificates = [], []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('console', lambda message: errors.append(message.text) if message.type == 'error' else None)
        page.on('request', lambda request: full_certificates.append(request.url) if '/images/certificates/' in request.url and '-thumb.webp' not in request.url else None)
        response = page.goto(base + '/', wait_until='networkidle')
        check(label + ': HTTP 200', response.status == 200)
        photo = page.locator('.hero-photo img')
        photo.evaluate('async img => await img.decode()')
        source = '/images/hero-focus.webp' if width < 768 and dpr == 1 else '/images/hero-pcb.jpg'
        check(label + ': correct responsive photo stays under the deployment base', photo.evaluate('img => img.currentSrc') == base + source)
        check(label + ': circuit photo is prioritized', photo.get_attribute('fetchpriority') == 'high' and photo.get_attribute('loading') != 'lazy')
        check(label + ': primary actions fit in the first viewport', page.locator('.hero-actions a').evaluate_all('els => els.length === 2 && els.every(el => { const r=el.getBoundingClientRect(); return r.width>=44 && r.height>=44 && r.left>=0 && r.right<=innerWidth && r.bottom<=innerHeight; })'))
        if width < 768:
            area = page.evaluate('''() => {
                const hero=document.querySelector('.home-hero').getBoundingClientRect();
                const actions=document.querySelector('.hero-actions').getBoundingClientRect();
                return {top:Math.ceil(actions.bottom+12),bottom:Math.floor(Math.min(hero.bottom,innerHeight)-8)};
            }''')
            check(label + ': at least 90px of unobstructed circuit imagery before scrolling', area['bottom']-area['top'] >= 90)
            shot = page.screenshot(animations='disabled')
            tile = Image.open(BytesIO(shot)).convert('RGB').crop((12*dpr,area['top']*dpr,(width-12)*dpr,area['bottom']*dpr))
            check(label + ': visible circuit region has photographic detail', max(ImageStat.Stat(tile).stddev) > 12)
        check(label + ': hero introduces the association and learning resources', page.locator('.hero-actions a').evaluate_all('els => els.map(el => ({text:el.textContent,href:el.href}))') == [{'text':'了解协会','href':base+'/about'},{'text':'学习资源','href':base+'/resources'}])
        check(label + ': learning and activities precede project records', page.evaluate('document.querySelector(".home-directions").offsetTop < document.querySelector(".home-activities").offsetTop && document.querySelector(".home-activities").offsetTop < document.querySelector(".home-projects").offsetTop'))
        rows = page.locator('.home-project-row')
        check(label + ': all project titles follow the content source', rows.locator('h3').all_text_contents() == [project['name'] for project in content['projects']])
        check(label + ': project titles share a restrained scale', rows.locator('h3').evaluate_all('els => { const sizes=els.map(el => parseFloat(getComputedStyle(el).fontSize)); return sizes.length>0 && new Set(sizes).size===1 && Math.max(...sizes)<=20; }'))
        page.screenshot(path=str(out / f'home-{width}-{"dark" if dark else "light"}-{dpr}x-viewport.png'), animations='disabled')
        entry = page.get_by_role('region', name='竞赛荣誉', exact=True)
        entry.scroll_into_view_if_needed()
        check(label + ': honors are the final homepage section', entry.evaluate('el => el === document.querySelector("main").lastElementChild && el.previousElementSibling.matches(".join-banner")'))
        check(label + ': honors remain compact', entry.evaluate('el => el.getBoundingClientRect().height <= 180'))
        check(label + ': honors entry opens the complete archive', entry.get_by_role('link', name='浏览荣誉', exact=True).evaluate('el => el.href') == base + '/awards')
        check(label + ': homepage omits the expanded award and certificate displays', page.locator('.awards-preview, img[src*="/certificates/"]').count() == 0 and not full_certificates)
        check(label + ': no horizontal overflow', page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
        check(label + ': no console errors', not errors)
        if width in [390,1440] and not dark and dpr == 1:
            page.screenshot(path=str(out / f'home-{width}-honors.png'), animations='disabled')
            page.locator('.home-projects').scroll_into_view_if_needed()
            page.screenshot(path=str(out / f'home-{width}-projects.png'), animations='disabled')
        context.close()
