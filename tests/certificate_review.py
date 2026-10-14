"""Exercise public certificate images through the real viewer and inspect redacted pixels."""
from pathlib import Path
import json

MANIFEST = json.loads((Path(__file__).resolve().parents[1] / 'docs/review/certificates-manifest.json').read_text(encoding='utf-8'))


def review_certificates(page, base, content, out, check, check_touch_targets, label, all_records=False):
    requests = []
    def requested(request):
        if '/images/certificates/' in request.url and '-thumb.webp' not in request.url:
            requests.append(request.url)
    page.on('request', requested)
    response = page.goto(base + '/awards/', wait_until='networkidle')
    check(f'{label}: certificate page returns HTTP 200', response.status == 200)
    check(f'{label}: full certificate files wait until opened', not requests)
    cards = page.locator('.certificate-wall__item')
    check(f'{label}: each award has a wall preview', cards.locator('.certificate-thumbnail').count() == len(content['awards']))
    check(f'{label}: wall sits above the complete text archive', page.locator('.certificate-exhibition').evaluate("el => el.getBoundingClientRect().bottom <= document.querySelector('#award-records').getBoundingClientRect().top"))
    check(f'{label}: text archive has all records and no embedded thumbnails', page.locator('#award-records .award-card').count() == len(content['awards']) and page.locator('#award-records img').count() == 0)
    indices = range(len(content['awards'])) if all_records else [0, 2]
    for index in indices:
        award = content['awards'][index]
        opener = cards.nth(index).locator('.certificate-thumbnail')
        check_touch_targets(f'{label} {award["id"]} thumbnail', opener)
        opener.click()
        dialog = page.locator('dialog.certificate-viewer')
        dialog.wait_for(state='visible')
        image = dialog.locator('img')
        image.evaluate('async img => await img.decode()')
        check(f'{label} {award["id"]}: opens the matching full image', image.evaluate('img => img.src') == base + award['certificate']['image'])
        check(f'{label} {award["id"]}: image has its published dimensions', image.evaluate('(img, expected) => img.naturalWidth === expected.width && img.naturalHeight === expected.height', award['certificate']))
        check(f'{label} {award["id"]}: image fits the viewing area', image.evaluate('''img => {
            const a=img.getBoundingClientRect(), b=img.parentElement.getBoundingClientRect();
            return a.width > 0 && a.height > 0 && a.width <= b.width && a.height <= b.height;
        }'''))
        check_touch_targets(f'{label} viewer controls', dialog.locator('button, a'))
        check(f'{label}: modal locks background scrolling', page.evaluate('document.body.style.overflow === "hidden"'))
        if all_records:
            record = next(record for record in MANIFEST['records'] if record['id'] == award['id'])
            check(f'{label} {award["id"]}: sensitive regions are fully opaque solid pixels', image.evaluate('''(img, expected) => {
                const canvas=document.createElement('canvas'); canvas.width=img.naturalWidth; canvas.height=img.naturalHeight;
                const ctx=canvas.getContext('2d', {willReadFrequently:true}); ctx.drawImage(img,0,0);
                return expected.masks.every(({rect:[x0,y0,x1,y1]}) => {
                    const data=ctx.getImageData(x0,y0,x1-x0,y1-y0).data;
                    for(let i=0;i<data.length;i+=4) if(data[i]!==expected.fill[0] || data[i+1]!==expected.fill[1] || data[i+2]!==expected.fill[2] || data[i+3]!==255) return false;
                    return true;
                });
            }''', {'masks': record['masks'], 'fill': MANIFEST['fill']}))
        dialog.get_by_role('button', name='放大', exact=True).click()
        canvas = dialog.get_by_role('region', name='证明图片，可滚动查看', exact=True)
        check(f'{label} {award["id"]}: zoomed view supports scrolling', canvas.evaluate('el => el.scrollWidth > el.clientWidth || el.scrollHeight > el.clientHeight'))
        canvas.evaluate('el => el.scrollTo(100,100)')
        check(f'{label}: enlarged image can pan', canvas.evaluate('el => el.scrollLeft > 0 || el.scrollTop > 0'))
        dialog.get_by_role('button', name='适应屏幕', exact=True).click()
        standalone = dialog.get_by_role('link', name='单独打开', exact=True)
        check(f'{label}: standalone link uses only the public copy', standalone.evaluate('el => el.href') == base + award['certificate']['image'] and standalone.get_attribute('target') == '_blank' and 'noopener' in standalone.get_attribute('rel'))
        if index in [0, 2]:
            filename = f'{label.replace(" ", "-")}-certificate-{index}.png'
            page.screenshot(path=str(out / filename), animations='disabled')
        close = dialog.get_by_role('button', name='关闭证书大图', exact=True)
        close.focus()
        page.keyboard.press('Shift+Tab')
        check(f'{label}: keyboard focus remains in modal', dialog.evaluate('el => el.contains(document.activeElement)'))
        if index % 2:
            page.keyboard.press('Escape')
        else:
            close.click()
        check(f'{label}: dialog closes', not dialog.count())
        check(f'{label}: close restores the thumbnail focus', opener.evaluate('el => document.activeElement === el'))
        check(f'{label}: close restores document scrolling', page.evaluate('document.body.style.overflow !== "hidden"'))
        check(f'{label}: modal causes no document overflow', page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
    page.remove_listener('request', requested)
