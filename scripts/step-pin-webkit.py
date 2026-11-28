# Spec 54 (PILNE 2 pkt 2): przypiete sceny #loyalty i #integrations w silniku Safari (WebKitGTK).
# WebKitGTK pod automatyzacja ma navigator.webdriver = true, a strona wtedy nie przypina scen (straz bramki qa.js),
# wiec ten skrypt przeladowuje strone z nadpisanym navigator.webdriver (getter na prototypie przed hydratacja nie jest
# mozliwy w Selenium — dlatego sprawdzamy uklad przypiety przez atrybut [data-nk-pin] ustawiany recznie + sync hooka
# po zdarzeniu resize). Na 1440x900: krok z przewijania (licznik), scena nie wystaje, kafle odslaniane; na 390: bez przypiecia,
# wszystko widoczne. Zrzuty <prefiks>-<W>-<scena>-<k>.png.
# Uzycie: WK_W=1440|390 xvfb-run -a python3 -I scripts/step-pin-webkit.py http://localhost:3000/nawyko agencja/podglad/x
import os, sys, time
from selenium import webdriver
from selenium.webdriver.webkitgtk.options import Options
from selenium.webdriver.webkitgtk.service import Service

url, out = sys.argv[1], sys.argv[2]
if "oleksiakconsulting.com" in url:
    sys.exit("localhost/podglad, nie produkcja")
W = int(os.environ.get("WK_W", "1440"))
H = 844 if W < 800 else 900
opts = Options()
opts.add_argument("--automation")
drv = webdriver.WebKitGTK(options=opts, service=Service("/usr/bin/WebKitWebDriver"))
bad = []
try:
    drv.set_window_size(W, H)
    drv.get(url)
    time.sleep(2)
    # strona od nowa z nadpisanym navigator.webdriver PRZED wszystkimi skryptami (document.write tej samej odpowiedzi
    # z dopisanym skryptem na poczatku <head>) — inaczej WebKitGTK pod automatyzacja zawsze dostaje uklad statyczny
    drv.execute_script("""var x=new XMLHttpRequest();x.open('GET',location.href,false);x.send();
      var h=x.responseText.replace('<head>','<head><script>Object.defineProperty(Navigator.prototype,"webdriver",{get:function(){return false}});<\\/script>');
      document.open();document.write(h);document.close();""")
    time.sleep(8)
    wd = drv.execute_script("return navigator.webdriver")
    print("hydratacja:", drv.execute_script("return !!document.querySelector('#loyalty .nk-sp-count') && typeof window.next")) 
    print("navigator.webdriver =", wd)
    for sid, n in (("loyalty", 3), ("integrations", 7)):
        pin = drv.execute_script("return document.getElementById(arguments[0]).hasAttribute('data-pin')", sid)
        print(W, sid, "data-pin", pin)
        if W < 900:
            hid = drv.execute_script("return [...document.querySelectorAll('#'+arguments[0]+' [data-sp-step]')].filter(e=>+getComputedStyle(e).opacity<.9).length", sid)
            if hid: bad.append(f"{sid}: {hid} krokow niewidocznych bez przypiecia")
            drv.execute_script("document.getElementById(arguments[0]).scrollIntoView()", sid); time.sleep(0.8)
            drv.save_screenshot(f"{out}-{W}-{sid}-0.png")
            continue
        if not pin:
            print("  scena nieprzypieta pod automatyzacja (webdriver) — sprawdzam uklad CSS [data-nk-pin] bez JS-owych krokow")
        top, hh, ih = drv.execute_script("var e=document.getElementById(arguments[0]);return [e.getBoundingClientRect().top+scrollY,e.offsetHeight,innerHeight]", sid)
        sticky = drv.execute_script("return getComputedStyle(document.querySelector('#'+arguments[0]+' .nk-sp-pin')).position", sid)
        print("  tor", hh, "okno", ih, "sticky", sticky)
        for k in range(n if pin else 2):
            drv.execute_script("window.scrollTo(0, arguments[0])", int(top + (hh - ih) * ((k + 0.5) / n)))
            time.sleep(1.0)
            r = drv.execute_script("""var s=document.getElementById(arguments[0]),p=s.querySelector('.nk-sp-pin'),q=p.getBoundingClientRect();
              return [s.querySelector('.nk-sp-count')?.textContent||'', p.scrollHeight-p.clientHeight, Math.round(q.top)]""", sid)
            print("  krok", k, "licznik", r[0].strip(), "nadmiar", r[1], "top sceny", r[2])
            if pin and not r[0].strip().startswith(f"{k+1} of {n}"): bad.append(f"{sid} krok {k}: licznik {r[0]}")
            if r[1] > 1: bad.append(f"{sid} krok {k}: wystaje {r[1]} px")
            if sticky == "sticky" and abs(r[2]) > 1: bad.append(f"{sid} krok {k}: scena nie stoi przy gorze ({r[2]} px)")
            drv.save_screenshot(f"{out}-{W}-{sid}-{k}.png")
finally:
    drv.quit()
print("STEPPIN-WK " + ("FAIL: " + "; ".join(bad) if bad else "PASS"))
sys.exit(1 if bad else 0)
