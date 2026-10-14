"""Association-first homepage, responsive circuit imagery, and final honors section."""
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
        directions = page.locator('.home-directions .direction-card')
        check(label + ': learning directory retains every published direction', directions.locator('h3').all_text_contents() == [direction['name'] for direction in content['directions']] and directions.locator('p').all_text_contents() == [direction['tags'] for direction in content['directions']])
        activities = page.locator('.home-activities .activity-card')
        check(label + ': journal retains every activity title and date', activities.locator('h3').all_text_contents() == [activity['title'] for activity in content['activities']] and activities.locator('.card-bottom > span').all_text_contents() == [activity['duration'] for activity in content['activities']])
        if width < 768:
            check(label + ': directory is one continuous column with usable touch areas', directions.evaluate_all('els => { const rs=els.map(el=>el.getBoundingClientRect()); return rs.length>0 && rs.every((r,i)=>r.height>=44 && Math.abs(r.left-rs[0].left)<1 && Math.abs(r.width-rs[0].width)<1 && (i===0 || r.top>=rs[i-1].bottom-1)); }'))
            check(label + ': journal metadata shares a row without overlapping titles', activities.evaluate_all('els => els.every(el => { const title=el.querySelector("h3").getBoundingClientRect(), category=el.querySelector(".activity-category").getBoundingClientRect(), date=el.querySelector(".card-bottom").getBoundingClientRect(); return Math.max(category.bottom,date.bottom)<=title.top+1 && category.right<=date.left+1 && Math.abs((category.top+category.bottom-date.top-date.bottom)/2)<4; })'))
            check(label + ': section headings and browse links share a row without overlap', page.locator('.home-directions .section-heading, .home-activities .section-heading, .home-projects .section-heading').evaluate_all('els => els.every(el => { const h=el.querySelector("h2").getBoundingClientRect(), a=el.querySelector("a").getBoundingClientRect(); return h.right<=a.left && h.top<a.bottom && a.top<h.bottom && a.height>=44; })'))
        rows = page.locator('.home-project-row')
        check(label + ': all project titles follow the content source', rows.locator('h3').all_text_contents() == [project['name'] for project in content['projects']])
        check(label + ': project titles share a restrained scale', rows.locator('h3').evaluate_all('els => { const sizes=els.map(el => parseFloat(getComputedStyle(el).fontSize)); return sizes.length>0 && new Set(sizes).size===1 && Math.max(...sizes)<=20; }'))
        page.screenshot(path=str(out / f'home-{width}-{"dark" if dark else "light"}-{dpr}x-viewport.png'), animations='disabled')
        honors = page.get_by_role('region', name='竞赛荣誉', exact=True)
        honors.scroll_into_view_if_needed()
        check(label + ': complete honors section closes the homepage', honors.evaluate('el => el === document.querySelector("main").lastElementChild && el.previousElementSibling.matches(".join-banner")'))
        preview = honors.locator('.home-certificate-preview')
        preview.locator('img').evaluate_all('imgs => imgs.forEach(img => img.loading="eager")')
        preview.locator('img').evaluate_all('async imgs => await Promise.all(imgs.map(img => img.decode()))')
        expected = [base + award['certificate']['thumbnail'] for award in content['awards'][:3]]
        check(label + ': bottom section retains the published certificate collage', preview.locator('img').evaluate_all('imgs => imgs.map(img => img.currentSrc)') == expected)
        check(label + ': bottom preview loads without full certificates', not full_certificates)
        check(label + ': bottom preview opens the certificate wall', preview.evaluate('el => el.href') == base + '/awards')
        check(label + ': no horizontal overflow', page.evaluate('document.documentElement.scrollWidth<=innerWidth'))
        check(label + ': no console errors', not errors)
        if width in [390,1440] and not dark and dpr == 1:
            page.screenshot(path=str(out / f'home-{width}-honors.png'), animations='disabled')
            for section in ['directions', 'activities']:
                page.locator(f'.home-{section}').scroll_into_view_if_needed()
                page.screenshot(path=str(out / f'home-{width}-{section}.png'), animations='disabled')
            page.locator('.home-projects').scroll_into_view_if_needed()
            page.screenshot(path=str(out / f'home-{width}-projects.png'), animations='disabled')
        context.close()
