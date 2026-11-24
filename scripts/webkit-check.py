# WebKit (Safari engine) check of a page at iPhone size: screenshots at scroll positions and phone-frame widths.
# Why: Chromium-only gates missed a phone that collapsed into a thin bar on iPhone and Mac Safari (Rafał, 24.11.2026).
# Setup (once per container; Playwright's own WebKit download is blocked here):
#   apt-get install -y webkit2gtk-driver xvfb && pip install --break-system-packages selenium
# Usage (local server only, never the production domain):
#   xvfb-run -a python3 -I scripts/webkit-check.py http://localhost:3000/nawyko /tmp/wk-nawyko [css-override-file]
#   WK_W=1440 xvfb-run -a python3 -I scripts/webkit-check.py ...   # Mac size (1440x900, desktop Safari UA)
# Fail rule for the gate: any visible phone narrower than 150 px -> exit code 1 and a FAIL line.
import os, sys, time
from selenium import webdriver
from selenium.webdriver.webkitgtk.options import Options
from selenium.webdriver.webkitgtk.service import Service

url, out = sys.argv[1], sys.argv[2]
override = open(sys.argv[3]).read() if len(sys.argv) > 3 else None
UA = ("Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 "
      "(KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1")
W = int(os.environ.get("WK_W", "390"))
H_VIEW = 844 if W < 800 else 900
if W >= 800:
    UA = ("Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/605.1.15 "
          "(KHTML, like Gecko) Version/18.0 Safari/605.1.15")
opts = Options()

opts.add_argument("--automation")
drv = webdriver.WebKitGTK(options=opts, service=Service("/usr/bin/WebKitWebDriver"))
bad = []
try:
    drv.set_window_size(W, H_VIEW)
    drv.get(url)
    time.sleep(3)
    if override:
        drv.execute_script("var s=document.createElement('style');s.textContent=arguments[0];document.head.appendChild(s);", override)
        time.sleep(1)
    vw = drv.execute_script("return [window.innerWidth, window.innerHeight]")
    print("viewport", vw)
    # Safari 26+ supports CSS scroll-driven animations (webkit.org/blog/17333); iOS 18 does not -> always @supports + static fallback.
    print("supports animation-timeline:scroll()", drv.execute_script("return CSS.supports('animation-timeline','scroll()')"),
          "| engine", drv.execute_script("return navigator.userAgent.match(/AppleWebKit\\/[\\d.]+/)?.[0]"))
    H = drv.execute_script("return document.documentElement.scrollHeight")
    for i, frac in enumerate([0.0, 0.08, 0.16, 0.24, 0.4, 0.6, 0.8, 0.97]):
        drv.execute_script("window.scrollTo(0, arguments[0])", int(H * frac))
        time.sleep(1.2)
        phones = drv.execute_script(
            "return [...document.querySelectorAll('.nk-phone,.ga-phone')].filter(e=>{const r=e.getBoundingClientRect();return r.bottom>0&&r.top<innerHeight}).map(e=>{const r=e.getBoundingClientRect();return [Math.round(r.width),Math.round(r.height)]})")
        print(f"scroll {frac:.2f} visible phones (w,h):", phones)
        bad += [p for p in phones if p[0] < 150]
        drv.save_screenshot(f"{out}-{i}.png")
finally:
    drv.quit()
if bad:
    print("FAIL: phone narrower than 150 px:", bad)
    sys.exit(1)
print("PASS: no visible phone narrower than 150 px")
