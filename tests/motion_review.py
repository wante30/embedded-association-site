"""Check real scroll behavior, keyboard access, and reduced-motion fallbacks."""


def review_motion(browser, base, check):
    for width in [390, 1440]:
        context = browser.new_context(viewport={'width': width, 'height': 844}, reduced_motion='no-preference')
        page = context.new_page()
        errors = []
        page.on('pageerror', lambda error: errors.append(str(error)))
        page.goto(base + '/', wait_until='networkidle')
        check(f'motion {width}: initial heading stays visible', page.locator('h1').evaluate('el => getComputedStyle(el).opacity === "1"'))
        pending = page.locator('[data-reveal-pending]').first
        check(f'motion {width}: offscreen components are prepared', pending.count() == 1)
        target = pending.element_handle()
        check(f'motion {width}: pending component starts transparent', target.evaluate('el => getComputedStyle(el).opacity === "0"'))
        target.scroll_into_view_if_needed()
        page.wait_for_function('el => !el.hasAttribute("data-reveal-pending") && getComputedStyle(el).opacity === "1"', arg=target)
        check(f'motion {width}: scrolling reveals the component', target.is_visible())
        page.evaluate('window.scrollTo(0,0)')
        check(f'motion {width}: revealed component stays revealed', target.get_attribute('data-reveal-pending') is None)
        hidden_link = page.locator('[data-reveal-pending] a, a[data-reveal-pending]').last.element_handle()
        hidden_link.focus()
        check(f'motion {width}: keyboard focus immediately reveals its component', hidden_link.evaluate('el => !el.closest("[data-reveal-pending]")'))
        page.goto(base + '/awards/', wait_until='networkidle')
        page.get_by_role('link', name='浏览文字档案 ↓', exact=True).click()
        page.wait_for_function('document.querySelector("#award-records").getBoundingClientRect().top < innerHeight')
        page.wait_for_function('!document.querySelector("#award-records .award-card").hasAttribute("data-reveal-pending")')
        check(f'motion {width}: archive jump reveals text records', page.locator('#award-records .award-card').first.is_visible())
        page.goto(base + '/resources/', wait_until='networkidle')
        page.get_by_role('button', name='FPGA', exact=True).click()
        page.get_by_role('button', name='全部', exact=True).click()
        last = page.locator('.resource-card').last
        last.scroll_into_view_if_needed()
        page.wait_for_function('el => !el.hasAttribute("data-reveal-pending") && getComputedStyle(el).opacity === "1"', arg=last.element_handle())
        check(f'motion {width}: newly filtered content reveals normally', last.is_visible())
        page.locator('.site-header .brand').click()
        page.wait_for_selector('.home-hero')
        page.wait_for_function('scrollY === 0 && document.querySelector("[data-reveal-pending]")')
        check(f'motion {width}: client navigation resets scroll before preparing new content', page.locator('.home-hero').count() == 1 and page.locator('[data-reveal]').evaluate_all('els => els.filter(el => el.getBoundingClientRect().top > innerHeight + 32).every(el => el.hasAttribute("data-reveal-pending"))'))
        page.emulate_media(reduced_motion='reduce')
        page.wait_for_function('!document.querySelector("[data-reveal-pending]")')
        check(f'motion {width}: changing to reduced motion reveals everything', page.locator('[data-reveal]').evaluate_all('els => els.every(el => getComputedStyle(el).opacity === "1" && getComputedStyle(el).transform === "none")'))
        check(f'motion {width}: no horizontal overflow', page.evaluate('document.documentElement.scrollWidth <= innerWidth'))
        check(f'motion {width}: no runtime errors', not errors)
        context.close()

    for mode in ['reduced', 'no-observer']:
        context = browser.new_context(viewport={'width': 390, 'height': 844}, reduced_motion='reduce' if mode == 'reduced' else 'no-preference')
        if mode == 'no-observer':
            context.add_init_script('window.IntersectionObserver = undefined')
        page = context.new_page()
        page.goto(base + '/awards/', wait_until='networkidle')
        check(f'{mode}: certificate wall and archive never remain hidden', page.locator('[data-reveal]').evaluate_all('els => els.length > 16 && els.every(el => getComputedStyle(el).opacity === "1" && !el.hasAttribute("data-reveal-pending"))'))
        context.close()
