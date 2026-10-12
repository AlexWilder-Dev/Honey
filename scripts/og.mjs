// One-off: builds the link-preview card (public/og.jpg, 1200×630) and the
// favicons from the venue's photo and wordmark. Letters are traced from the
// Caslon font files so the output doesn't depend on fonts installed locally.
import sharp from 'sharp'
import opentype from 'opentype.js'
import { readFileSync, writeFileSync, statSync } from 'node:fs'

const fontFile = (f) => {
  const b = readFileSync(`node_modules/@fontsource/libre-caslon-text/files/${f}`)
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength))
}
const roman = fontFile('libre-caslon-text-latin-400-normal.woff')
const italic = fontFile('libre-caslon-text-latin-400-italic.woff')
const della = (() => {
  const b = readFileSync('node_modules/@fontsource/della-respira/files/della-respira-latin-400-normal.woff')
  return opentype.parse(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength))
})()

// their brand: black, white and the yellow of the awnings and front door
const CREAM = '#ffffff'
const HONEY = '#ffc700'
const DOOR = '#ffc700'
const CHAR = '#111110'

const path = (font, text, x, y, size) => font.getPath(text, x, y, size).toPathData(2)
const width = (font, text, size) => font.getAdvanceWidth(text, size)

// "Hive" set in from the left, "Honey" below, a swash ampersand between them:
// the arrangement on their signage and printed menus.
function wordmark(x, y, size, ink = CREAM, amp = HONEY) {
  const lead = size * 0.86
  const hive = path(roman, 'Hive', x + size * 0.62, y, size)
  const honey = path(roman, 'Honey', x, y + lead, size)
  const ampSize = size * 0.74
  const and = path(italic, '&', x + size * 0.98, y + lead * 0.56, ampSize)
  return `<path d="${hive}" fill="${ink}"/><path d="${honey}" fill="${ink}"/><path d="${and}" fill="${amp}"/>`
}

// Flat-topped hexagon
const hex = (cx, cy, r) =>
  [0, 60, 120, 180, 240, 300]
    .map((a) => [cx + r * Math.cos((a * Math.PI) / 180), cy + r * Math.sin((a * Math.PI) / 180)])
    .map(([px, py], i) => `${i ? 'L' : 'M'}${px.toFixed(2)} ${py.toFixed(2)}`)
    .join('') + 'Z'

function glyphIn(font, ch, cx, cy, size, fill) {
  const p = font.getPath(ch, 0, 0, size)
  const bb = p.getBoundingBox()
  const dx = cx - (bb.x1 + bb.x2) / 2
  const dy = cy - (bb.y1 + bb.y2) / 2
  return `<path d="${font.getPath(ch, dx, dy, size).toPathData(2)}" fill="${fill}"/>`
}

// The H&H monogram from their menus: H, & and H in three hexagons.
function monogram(ox, oy, r, ink, amp, stroke) {
  const cells = [
    [ox, oy, 'H', roman, ink],
    [ox + 2.1 * r, oy - 0.25 * r, '&', italic, amp],
    [ox + 3.44 * r, oy + 1.06 * r, 'H', roman, ink],
  ]
  return cells
    .map(([cx, cy, ch, font, fill]) =>
      `<path d="${hex(cx, cy, r)}" fill="none" stroke="${ink}" stroke-width="${stroke}" stroke-linejoin="round"/>` +
      glyphIn(font, ch, cx, cy, r * 1.05, fill))
    .join('')
}

// ---------- og.jpg ----------
const W = 1200, H = 630
const photo = await sharp('public/media/site/R5_HIVE_003.JPG')
  .rotate()
  .resize({ width: 1200 })
  .extract({ left: 0, top: 560, width: W, height: H })
  .modulate({ brightness: 1.02, saturation: 1.05 })
  .toBuffer()

const size = 118
const panelX = 700
const textX = 760
const overlay = `
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <rect x="${panelX}" y="0" width="${W - panelX}" height="${H}" fill="${CHAR}"/>
  <rect x="${panelX}" y="0" width="${W - panelX}" height="34" fill="${HONEY}"/>
  <rect x="${panelX}" y="34" width="${W - panelX}" height="12" fill="#e3a900"/>
  ${wordmark(textX, 230, size)}
  <path d="${path(della, '42 SILVER STREET', textX + 4, 452, 34)}" fill="${CREAM}"/>
  <path d="${path(della, 'LEICESTER', textX + 4, 494, 34)}" fill="${CREAM}"/>
  <rect x="${textX + 4}" y="530" width="72" height="4" fill="${HONEY}"/>
  <path d="${path(della, 'COCKTAILS · SHARING PLATES · COURTYARD', textX + 4, 574, 15.5)}" fill="#bdb8ad"/>
</svg>`

await sharp(photo)
  .composite([{ input: Buffer.from(overlay), top: 0, left: 0 }])
  .jpeg({ quality: 88, mozjpeg: true })
  .toFile('public/og.jpg')

const meta = await sharp('public/og.jpg').metadata()
console.log(`og.jpg ${meta.width}x${meta.height} ${(statSync('public/og.jpg').size / 1024).toFixed(1)}KB`)

// ---------- icons ----------
// Small sizes: the ampersand cell on its own, so it still reads at 16px.
const favSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${CHAR}"/>
  <path d="${hex(32, 32, 25)}" fill="none" stroke="${DOOR}" stroke-width="3.2" stroke-linejoin="round"/>
  ${glyphIn(italic, '&', 32, 33, 32, DOOR)}
</svg>`
writeFileSync('public/favicon.svg', favSvg)
await sharp(Buffer.from(favSvg)).resize(32, 32).png().toFile('public/favicon-32.png')

// Home-screen icon: the full monogram.
const touch = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="${CHAR}"/>
  ${monogram(45.3, 79.5, 26, CREAM, DOOR, 2.6)}
</svg>`
await sharp(Buffer.from(touch)).png().toFile('public/apple-touch-icon.png')

// Footer mark, drawn in currentColor so the page can tint it.
const mono = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="2 13 113 66" fill="currentColor">
  ${monogram(24, 38, 20, 'currentColor', 'currentColor', 1.6)}
</svg>`
writeFileSync('src/components/monogram.svg', mono)
console.log('icons written')
