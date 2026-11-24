# WebKit (Safari engine): the /calculator slider must change the result by drag (pointer) and by keyboard (R4 p14 B1d).
# Why: Chromium gates cannot show whether a styled <input type=range> moves in Safari.
# Setup: as scripts/webkit-check.py (webkit2gtk-driver, xvfb, selenium).
# Usage (local server only): xvfb-run -a python3 -I scripts/webkit-slider-check.py http://localhost:3000 [shot-prefix]
#   WK_W=1440 for Mac size. Exit 1 when drag or keyboard leaves the slider value or the big number unchanged.
import os, sys, time
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.webkitgtk.options import Options
from selenium.webdriver.webkitgtk.service import Service

base = sys.argv[1].rstrip("/")
if not any(h in base for h in ("://localhost", "://127.0.0.1")):
    print("local server only"); sys.exit(2)
shot = sys.argv[2] if len(sys.argv) > 2 else None
W = int(os.environ.get("WK_W", "390"))
H = 844 if W < 800 else 900
opts = Options(); opts.add_argument("--automation")
drv = webdriver.WebKitGTK(options=opts, service=Service("/usr/bin/WebKitWebDriver"))
fails = []

def state():
    return drv.execute_script("return [document.querySelector('#gc-t').value, document.querySelector('.gc-num span').textContent]")

try:
    drv.set_window_size(W, H)
    drv.get(base + "/calculator")
    time.sleep(3)
    print("engine", drv.execute_script("return navigator.userAgent.match(/AppleWebKit\\/[\\d.]+/)?.[0]"), "| viewport", W)
    rng = drv.find_element(By.ID, "gc-t")
    drv.execute_script("arguments[0].scrollIntoView({block:'center'})", rng)
    time.sleep(0.5)
    s0 = state(); print("start", s0)
    # drag: grab the thumb at its current position and move it 35% of the track width to the left
    frac = drv.execute_script("const e=arguments[0];return (e.value-e.min)/(e.max-e.min)", rng)
    wpx = rng.size["width"]
    x0 = int((frac - 0.5) * (wpx - 46))  # offset from the element centre (thumb 46 px wide)
    ActionChains(drv).move_to_element_with_offset(rng, x0, 0).click_and_hold() \
        .move_by_offset(-int(wpx * 0.35), 0).release().perform()
    time.sleep(1)
    s1 = state(); print("after drag", s1)
    if s1[0] == s0[0] or s1[1] == s0[1]:
        fails.append(f"drag: value/number unchanged {s0} -> {s1}")
    if shot:
        drv.save_screenshot(f"{shot}-drag-{W}.png")
    # keyboard: focus by Tab from the last field, then ArrowLeft x3
    drv.find_element(By.ID, "gc-g").click()
    ActionChains(drv).send_keys(Keys.TAB).perform()
    time.sleep(0.3)
    act = drv.execute_script("return document.activeElement.id")
    ActionChains(drv).send_keys(Keys.ARROW_LEFT).send_keys(Keys.ARROW_LEFT).send_keys(Keys.ARROW_LEFT).perform()
    time.sleep(1)
    s2 = state(); print("after keys (focus on #%s)" % act, s2)
    if act != "gc-t":
        fails.append(f"keyboard: Tab from #gc-g focused #{act}, not #gc-t")
    if s2[0] == s1[0] or s2[1] == s1[1]:
        fails.append(f"keyboard: value/number unchanged {s1} -> {s2}")
    if shot:
        drv.save_screenshot(f"{shot}-keys-{W}.png")
finally:
    drv.quit()

for f in fails:
    print("FAIL " + f)
print("WEBKIT-SLIDER:", "FAIL" if fails else "PASS")
sys.exit(1 if fails else 0)
