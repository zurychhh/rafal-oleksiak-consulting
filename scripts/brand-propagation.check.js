/* Spec 26 bramka brand-propagation — funkcja uruchamiana na stronie (Chromium przez Playwright, WebKit przez Selenium).
   Wejscie: nazwa i kolor (rgb) wybrane wczesniej. Wynik: liczba wystapien nazwy demo w widocznym tekscie, lista usterek. */
(function (want, rgb) {
  const bad = []
  const demo = (document.body.innerText.match(/Tovemi/g) || []).length
  if (demo) bad.push('demo name visible ×' + demo)
  const bars = [...document.querySelectorAll('.nk-pbar, .nk-hhead, .ga-brand-bar')]
  for (const b of bars) if (!b.textContent.includes(want)) bad.push('name missing in ' + b.className + ': ' + b.textContent.slice(0, 40))
  const fills = [...document.querySelectorAll('.nk-pbar, .nk-hmono, .ga-brand-bar')]
  for (const f of fills) {
    const bg = getComputedStyle(f).backgroundColor
    if (bg !== rgb) bad.push('colour ' + bg + ' in ' + f.className)
  }
  const ask = document.querySelector('#nk-ask')
  if (ask && !ask.textContent.includes(want)) bad.push('final heading without the name: ' + ask.textContent)
  if (!bars.length) bad.push('no branded phone found')
  return { demo, bars: bars.length, fills: fills.length, bad }
})
