# PILNE 2 pkt 1 (Rafal 28.11.2026): test regresji „Reveal without scratching” po zmianie marki w silniku Safari
# (WebKitGTK przez Selenium; instalacja: bash scripts/setup-webkit.sh). Ten sam scenariusz co scripts/reveal-after-brand.mjs:
# karta w hero i w finale: Reveal -> zmiana marki (nazwa + kolor + styl) -> karta znow cala -> przeciagniecie zdrapuje
# -> Reveal odslania -> druga zmiana (sama nazwa) -> karta znow cala -> Reveal.
# Uzycie: xvfb-run -a python3 -I scripts/reveal-after-brand-webkit.py http://localhost:3000
import json, os, sys, time
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.webkitgtk.options import Options
from selenium.webdriver.webkitgtk.service import Service

base = sys.argv[1].rstrip('/')
if not base.startswith(('http://localhost', 'http://127.0.0.1')):
    sys.exit('localhost only')
check = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'reveal-after-brand.check.js')).read()
BTN = {'hero': '.nk-hbrand button.nk-link', 'finale': '.nk-fz-act button.nk-link'}
CANVAS = {'hero': '.nk-hcard:not(.nk-fz-card) canvas.nk-canvas', 'finale': '.nk-fz-card canvas.nk-canvas'}
opts = Options()
opts.add_argument('--automation')
drv = webdriver.WebKitGTK(options=opts, service=Service('/usr/bin/WebKitWebDriver'))
fail = 0


def st(which):
    return drv.execute_script('return (' + check + ')(arguments[0])', which)


def show(which):
    if which == 'hero':
        drv.execute_script('window.scrollTo(0,0)')
    else:
        drv.find_elements(By.CSS_SELECTOR, '.nk-fz-dots button')[2].click()  # chwila 07:32: ekran aplikacji z karta
    time.sleep(0.6)


def brand(name, colour_idx, skin_idx):
    drv.execute_script('window.scrollTo(0,0)'); time.sleep(0.3)
    inp = drv.find_element(By.CSS_SELECTOR, '.nk-hbrand input[type=text]')
    inp.click()
    drv.execute_script('arguments[0].select()', inp)
    inp.send_keys(name)
    if colour_idx is not None:
        drv.execute_script('arguments[0].click()', drv.find_elements(By.CSS_SELECTOR, '.nk-hbrand input[name="nk-hero-colour"]')[colour_idx])
    if skin_idx is not None:
        drv.execute_script('arguments[0].click()', drv.find_elements(By.CSS_SELECTOR, '.nk-hbrand input[name="nk-skin"]')[skin_idx])
    time.sleep(0.4)


try:
    for w, h in ((390, 844), (1440, 900)):
        drv.set_window_size(w, h)
        for which in ('hero', 'finale'):
            drv.get(base + '/nawyko'); time.sleep(1.5)
            drv.execute_script("try{localStorage.removeItem('oc-brand-v1')}catch(e){}")
            drv.get(base + '/nawyko'); time.sleep(2)
            res = []

            def expect(label, ok, s):
                global fail
                res.append('%s:%s' % (label, 'ok' if ok else 'FAIL'))
                if not ok:
                    fail += 1
                    print('  %s %d %s FAIL %s' % (which, w, label, json.dumps(s)))

            def reveal():
                show(which)
                drv.find_element(By.CSS_SELECTOR, BTN[which]).click()
                time.sleep(0.5)

            reveal(); s = st(which); expect('reveal0', bool(s['status']) and s['gone'], s)
            brand('Acme', 2, 1); show(which); s = st(which)
            expect('rearm1', not s['status'] and not s['gone'] and 0 <= s['cleared'] < 0.02, s)
            c = drv.find_element(By.CSS_SELECTOR, CANVAS[which])
            cw, ch = s['w'], s['h']
            a = ActionChains(drv)
            a.move_to_element_with_offset(c, int(-cw * 0.35), int(-ch * 0.2)).click_and_hold()
            for k in range(1, 7):
                a.move_to_element_with_offset(c, int(-cw * 0.35 + cw * 0.04 * k), int(-ch * 0.2 + ch * 0.07 * k))
            a.release().perform()
            time.sleep(0.3); s = st(which); expect('drag1', s['cleared'] > 0.03 and not s['gone'], s)
            reveal(); s = st(which); expect('reveal1', bool(s['status']) and s['gone'], s)
            brand('Acme Labs', None, None); show(which); s = st(which)
            expect('rearm2', not s['status'] and not s['gone'] and 0 <= s['cleared'] < 0.02, s)
            reveal(); s = st(which); expect('reveal2', bool(s['status']) and s['gone'], s)
            print('REVEAL-WK %d %s %s %s' % (w, which, 'PASS' if all(r.endswith('ok') for r in res) else 'FAIL', ' '.join(res)))
        drv.execute_script("try{localStorage.removeItem('oc-brand-v1')}catch(e){}")
finally:
    drv.quit()
print('REVEAL-WK RESULT %s fails=%d' % ('FAIL' if fail else 'PASS', fail))
sys.exit(1 if fail else 0)
