# WebKit (Safari engine) check of a page at iPhone size: screenshots at scroll positions and phone-frame widths.
# Why: Chromium-only gates missed a phone that collapsed into a thin bar on iPhone and Mac Safari (Rafał, 24.11.2026).
# Setup (once per container; Playwright's own WebKit download is blocked here):
#   apt-get install -y webkit2gtk-driver xvfb && pip install --break-system-packages selenium
# Usage (local server only, never the production domain):
#   xvfb-run -a python3 -I scripts/webkit-check.py http://localhost:3000/nawyko /tmp/wk-nawyko [css-override-file]
# Fail rule for the gate: any visible phone narrower than 150 px.
import sys, time
from selenium import webdriver
from selenium.webdriver.webkitgtk.options import Options
from selenium.webdriver.webkitgtk.service import Service

url, out = sys.argv[1], sys.argv[2]
override = open(sys.argv[3]).read() if len(sys.argv) > 3 else None
UA = ("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 "
      "(KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1")
opts = Options()

opts.add_argument("--automation")
drv = webdriver.WebKitGTK(options=opts, service=Service("/usr/bin/WebKitWebDriver"))
try:
    drv.set_window_size(390, 844)
    drv.get(url)
    time.sleep(3)
    if override:
        drv.execute_script("var s=document.createElement('style');s.textContent=arguments[0];document.head.appendChild(s);", override)
        time.sleep(1)
    vw = drv.execute_script("return [window.innerWidth, window.innerHeight]")
    print("viewport", vw)
    H = drv.execute_script("return document.documentElement.scrollHeight")
    for i, frac in enumerate([0.0, 0.08, 0.16, 0.24, 0.4]):
        drv.execute_script("window.scrollTo(0, arguments[0])", int(H * frac))
        time.sleep(1.2)
        phones = drv.execute_script(
            "return [...document.querySelectorAll('.nk-phone,.ga-phone')].filter(e=>{const r=e.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight}).map(e=>{const r=e.getBoundingClientRect();return [Math.round(r.width),Math.round(r.height)]})")
        print(f"scroll {frac:.2f} visible phones (w,h):", phones)
        drv.save_screenshot(f"{out}-{i}.png")
finally:
    drv.quit()
