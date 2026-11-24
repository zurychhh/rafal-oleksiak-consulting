# Bramka brand-propagation w silniku Safari (WebKitGTK przez Selenium; instalacja jak w scripts/webkit-check.py).
# Zapisuje wybor marki tak jak hero /nawyko (localStorage 'oc-brand-v1'), przeladowuje /nawyko i /work/genactiv,
# uruchamia scripts/brand-propagation.check.js. Samotest: bez wybranej marki ta sama funkcja MUSI dac FAIL (nazwa demo).
# Uzycie: xvfb-run -a python3 -I scripts/brand-propagation-webkit.py http://localhost:3000 [prefiks-zrzutow]
import json, os, sys, time
from selenium import webdriver
from selenium.webdriver.webkitgtk.options import Options
from selenium.webdriver.webkitgtk.service import Service

base = sys.argv[1].rstrip('/')
shot = sys.argv[2] if len(sys.argv) > 2 else None
if not base.startswith(('http://localhost', 'http://127.0.0.1')):
    sys.exit('localhost only')
check = open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'brand-propagation.check.js')).read()
NAME, HEX, RGB = 'Acme', '#1D5FA8', 'rgb(29, 95, 168)'
opts = Options()
opts.add_argument('--automation')
drv = webdriver.WebKitGTK(options=opts, service=Service('/usr/bin/WebKitWebDriver'))
fail = 0
try:
    for w, h in ((390, 844), (1440, 900)):
        drv.set_window_size(w, h)
        drv.get(base + '/nawyko'); time.sleep(2)
        drv.execute_script("localStorage.removeItem('oc-brand-v1')"); drv.get(base + '/nawyko'); time.sleep(2)
        r = drv.execute_script('return (' + check + ')(arguments[0], arguments[1])', NAME, RGB)
        self_ok = len(r['bad']) > 0 and r['demo'] > 0
        print('BRANDPROP-WK %d selftest %s (no brand chosen -> must fail: demo=%d)' % (w, 'PASS' if self_ok else 'FAIL', r['demo']))
        if not self_ok: fail += 1
        drv.execute_script("localStorage.setItem('oc-brand-v1', JSON.stringify({name: arguments[0], colour: arguments[1]}))", NAME, HEX)
        for label, path in (('reload', '/nawyko'), ('genactiv', '/work/genactiv')):
            drv.get(base + path); time.sleep(2.5)
            r = drv.execute_script('return (' + check + ')(arguments[0], arguments[1])', NAME, RGB)
            ok = not r['bad']
            if not ok: fail += 1
            print('BRANDPROP-WK %d %s %s phones=%d demo=%d %s' % (w, label, 'PASS' if ok else 'FAIL', r['bars'], r['demo'], '' if ok else json.dumps(r['bad'][:6])))
            if shot and label == 'reload':
                drv.execute_script('window.scrollTo(0,0)'); time.sleep(0.5)
                drv.save_screenshot('%s-%d.png' % (shot, w))
        drv.execute_script("localStorage.removeItem('oc-brand-v1')")
finally:
    drv.quit()
sys.exit(1 if fail else 0)
