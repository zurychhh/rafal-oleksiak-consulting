// Sciezka do Chromium dla skryptow Playwright (bramki, prerender, OG).
// Dlaczego: skrypty mialy na sztywno /opt/pw-browsers/chromium-1194, a obraz chmury ma dzis chromium-1243;
// bez PW_CHROMIUM launch({}) szukal przegladarki, ktorej nie ma, i bramka padala zamiast mierzyc (R4 p8).
// Kolejnosc: PW_CHROMIUM → najnowszy /opt/pw-browsers/chromium-<n>/chrome-linux*/chrome → undefined (playwright sam).
const fs = require('fs')
const path = require('path')

function chromiumExe() {
  const env = process.env.PW_CHROMIUM
  if (env && fs.existsSync(env)) return env
  const root = '/opt/pw-browsers'
  let dirs = []
  try { dirs = fs.readdirSync(root).filter((d) => /^chromium-\d+$/.test(d)) } catch { return undefined }
  dirs.sort((a, b) => Number(b.split('-')[1]) - Number(a.split('-')[1]))
  for (const d of dirs) {
    for (const sub of ['chrome-linux64', 'chrome-linux']) {
      const p = path.join(root, d, sub, 'chrome')
      if (fs.existsSync(p)) return p
    }
  }
  return undefined
}

module.exports = { chromiumExe }
