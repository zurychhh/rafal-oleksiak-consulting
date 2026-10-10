// ZASLEPKA — trasa /cv czeka na bundle z Claude Design.
// Nadpisuje ja: node scripts/ship-design.mjs <cv-bundle.html> --route cv --yes
// Dopoki DC jest null, /cv zwraca 404 i nie trafia do sitemap.xml.
import type { DcExport } from '../design/DcPage'

export const DC: DcExport | null = null
