"""Recommendations remain readable planning data with working native navigation."""


def review_competitions(browser, base, content, out, check):
    recommendations = content['competitionRecommendations']
    for width, height in [(320, 568), (390, 844), (1440, 1000)]:
        label = f'competitions {width}px'
        context = browser.new_context(viewport={'width': width, 'height': height}, is_mobile=width < 768, has_touch=width < 768, reduced_motion='reduce')
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.on('console', lambda message: errors.append(message.text) if message.type == 'error' else None)
        page.goto(base + '/', wait_until='networkidle')
        page.locator('.home-directions .direction-card').filter(has_text='技术竞赛').click()
        section = page.get_by_role('region', name='推荐竞赛', exact=True)
        section.wait_for()
        page.wait_for_function('document.querySelector("#recommended-competitions").getBoundingClientRect().top >= 0 && document.querySelector("#recommended-competitions").getBoundingClientRect().top < innerHeight')
        check(label + ': homepage entry opens recommendations under the deployment prefix', page.url == base + '/resources#recommended-competitions' or page.url == base + '/resources/#recommended-competitions')
        check(label + ': three planning groups are available and core recommendations start expanded', section.locator('details').count() == len(recommendations['groups']) and section.locator('details[open]').count() == 1 and section.locator('details').first.get_attribute('open') is not None)
        check(label + ': edition and planning scope are visible', recommendations['version'] in section.locator('.competition-recommendations__heading').inner_text() and recommendations['note'] in section.inner_text())
        for index, group in enumerate(recommendations['groups']):
            details = section.locator('details').nth(index)
            summary = details.locator('summary')
            check(label + f': {group["id"]} expansion control is usable', summary.evaluate('el => { const r=el.getBoundingClientRect(); return r.width>=44 && r.height>=44; }'))
            if details.get_attribute('open') is None:
                summary.click()
            records = [entry for entry in recommendations['entries'] if entry['priority'] == group['id']]
            items = details.locator('.competition-item')
            check(label + f': {group["id"]} keeps every recommended name', items.locator('h4').all_text_contents() == [entry['name'] for entry in records])
            check(label + f': {group["id"]} keeps the supplied topics and purpose', items.locator('.competition-item__topics').all_text_contents() == [entry['topics'] for entry in records] and items.locator('.competition-item__purpose').all_text_contents() == [entry['purpose'] for entry in records])
            check(label + f': {group["id"]} keeps suggested form and study year', all(entry['format'] in items.nth(i).inner_text() and entry['years'] in items.nth(i).inner_text() for i, entry in enumerate(records)))
            check(label + f': {group["id"]} expanded rows stay inside the viewport', items.evaluate_all('els => els.every(el => { const r=el.getBoundingClientRect(); return r.width>0 && r.left>=0 && r.right<=innerWidth; })'))
            summary.click()
            check(label + f': {group["id"]} collapses by native control', details.get_attribute('open') is None)
        page.get_by_role('navigation', name='资源页目录').get_by_role('link', name='官方文档', exact=True).click()
        page.get_by_role('button', name='FPGA', exact=True).click()
        check(label + ': document filters remain independent from competition recommendations', page.locator('.resource-card').count() == 4 and section.locator('.competition-item').count() == len(recommendations['entries']))
        page.get_by_role('navigation', name='资源页目录').get_by_role('link', name='推荐竞赛', exact=True).click()
        section.locator('details summary').first.click()
        if width in [390, 1440]:
            page.screenshot(path=str(out / f'recommended-competitions-{width}.png'), animations='disabled')
        response = page.reload(wait_until='networkidle')
        check(label + ': recommendation deep link refreshes with HTTP 200', response.status == 200 and page.locator('#recommended-competitions').count() == 1)
        page.wait_for_function('document.querySelector("#recommended-competitions").getBoundingClientRect().top >= 0 && document.querySelector("#recommended-competitions").getBoundingClientRect().top < innerHeight')
        check(label + ': refresh also positions the recommendation heading in view', section.locator('h2').is_visible())
        check(label + ': no horizontal overflow or browser errors', page.evaluate('document.documentElement.scrollWidth<=innerWidth') and not errors)
        context.close()
