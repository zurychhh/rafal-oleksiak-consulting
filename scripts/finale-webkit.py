# Spec 28 (R5 p2): wielki final /nawyko w silniku Safari (WebKitGTK) — piec chwil, szerokosc telefonu >= 150 px, stan chwili zgodny.
# Uzycie: WK_W=390|1440 xvfb-run -a python3 -I scripts/finale-webkit.py http://localhost:3100/nawyko agencja/podglad/r5p2-wk-final
# Instalacja: apt-get install -y webkit2gtk-driver xvfb; pip install --break-system-packages selenium. Tylko localhost.
import os, sys, time
from selenium import webdriver
from selenium.webdriver.webkitgtk.options import Options
from selenium.webdriver.webkitgtk.service import Service

url, out = sys.argv[1], sys.argv[2]
if "oleksiakconsulting.com" in url:
    sys.exit("localhost/podglad, nie produkcja")
W = int(os.environ.get("WK_W", "390"))
H = 844 if W < 800 else 900
opts = Options()
opts.add_argument("--automation")
drv = webdriver.WebKitGTK(options=opts, service=Service("/usr/bin/WebKitWebDriver"))
bad = []
try:
    drv.set_window_size(W, H)
    drv.get(url)
    time.sleep(3)
    drv.execute_script("var i=document.querySelector('.nk-hbrand input[type=text]');var s=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,'value').set;s.call(i,'Acme');i.dispatchEvent(new Event('input',{bubbles:true}));")
    time.sleep(0.5)
    top, hh, ih = drv.execute_script("var e=document.getElementById('finale');return [e.getBoundingClientRect().top+scrollY,e.offsetHeight,innerHeight]")
    for i in range(5):
        drv.execute_script("window.scrollTo(0, arguments[0])", int(top + (hh - ih) * ((i + 0.5) / 5)))
        time.sleep(1.2)
        at, pw, name = drv.execute_script("var f=document.getElementById('finale');var p=f.querySelector('.nk-fz-phone').getBoundingClientRect();return [f.dataset.at,Math.round(p.width),f.querySelector('.nk-hname').textContent]")
        print("moment", i, "data-at", at, "phone width", pw, "name", name)
        if pw < 150: bad.append(f"moment {i}: phone {pw}px")
        if str(at) != str(i): bad.append(f"moment {i}: data-at {at}")
        if name != "Acme": bad.append(f"moment {i}: name {name}")
        drv.save_screenshot(f"{out}-{W}-{i}.png")
finally:
    drv.quit()
print("FAIL: " + "; ".join(bad) if bad else "PASS: five moments, phone >= 150 px, brand name in the app")
sys.exit(1 if bad else 0)
