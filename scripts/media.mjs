// One-off: turns the venue's photos into responsive WebP/JPEG sets plus a
// tiny blurred placeholder, and writes the manifest the site reads.
// Run with `npm run media` after adding or swapping photos.
import sharp from 'sharp'
import { mkdir, writeFile } from 'node:fs/promises'
import { existsSync } from 'node:fs'

const SRC = 'public/media'
const OUT = 'public/img'
const WIDTHS = [480, 800, 1200, 1600, 2000, 2500]

// key → source photo, plus the alt text the site uses for it
const PHOTOS = {
  'courtyard-crowd': ['site/R5_HIVE_085.JPG', 'The courtyard on a busy evening: festoon lights, the globe lamp, the hexagon mural and the old brick wing behind'],
  'hero-glass': ['site/R5_HIVE_003.JPG', 'Two spritzes clinking across the bar'],
  kitchen: ['site/R5_HIVE_087.JPG', 'A pizza and a bowl of ravioli on a wooden table'],
  bar: ['site/R5_HIVE_027.JPG', 'A spritz on a table with a guest smiling behind it'],
  'hero-plates': ['site/WhatsApp_Image_2025-06-25_at_18.25.11_4b8bf375.jpg', 'A table covered in sharing plates, seen from above'],
  'bar-front': ['site/WhatsApp_Image_2025-06-09_at_15.39.31_847c1076.jpg', 'The bar: a black front of lit yellow hexagons under a timber top'],
  'courtyard-day': ['site/WhatsApp_Image_2025-06-25_at_18.21.23_87da8423.jpg', 'The courtyard in sunshine: green chairs, timber tables, old brick walls'],
  'courtyard-night': ['site/R5_HIVE_113.JPG', 'The courtyard at night under the globe lamp'],
  cheers: ['site/R5_HIVE_110.JPG', 'A guest laughing over a table of drinks in the courtyard at night'],
  upstairs: ['site/WhatsApp_Image_2026-01-23_at_23.53.52_16.jpg', 'Dinner upstairs in the rear wing, under curved timber braces and fairy lights'],
  'upstairs-room': ['site/R5_HIVE_071.JPG', 'The room upstairs under the old roof timbers, a wall of birch branches lit from below'],
  'poster-halloween': ['site/poster-halloween-2026.jpg', 'Poster: Basement Presents, Say Less, Dance More. Halloween Hive & Honey Garden Party, Friday 30th Oct, 8pm'],
  'poster-christmas': ['site/poster-christmas-2026.jpg', 'Poster: Christmas Menu, three course festive dining, £45 per person including welcome drink'],
  door: ['extra/door.jpg', 'The yellow front door of 42 Silver Street at dusk'],
}

await mkdir(OUT, { recursive: true })
const manifest = {}

for (const [key, [file, alt]] of Object.entries(PHOTOS)) {
  const path = `${SRC}/${file}`
  if (!existsSync(path)) { console.warn('missing', path); continue }
  const base = sharp(path).rotate()
  const { width, height } = await base.metadata()
  const widths = WIDTHS.filter((w) => w < width).concat(width).filter((w, i, a) => a.indexOf(w) === i)
  for (const w of widths) {
    await sharp(path).rotate().resize({ width: w }).webp({ quality: w > 1600 ? 66 : 72, effort: 5 }).toFile(`${OUT}/${key}-${w}.webp`)
  }
  const fallback = widths.find((w) => w >= 800) ?? width
  await sharp(path).rotate().resize({ width: fallback }).jpeg({ quality: 76, mozjpeg: true }).toFile(`${OUT}/${key}-${fallback}.jpg`)
  const blur = await sharp(path).rotate().resize({ width: 16 }).blur(0.6).webp({ quality: 40 }).toBuffer()
  manifest[key] = { alt, width, height, widths, fallback, blur: `data:image/webp;base64,${blur.toString('base64')}` }
  console.log(key, `${width}x${height}`, widths.join(','))
}

await writeFile('src/data/images.json', JSON.stringify(manifest, null, 2) + '\n')
console.log('wrote src/data/images.json')
