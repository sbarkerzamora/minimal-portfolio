import { createRequire } from "node:module"
import { fileURLToPath } from "node:url"

const require = createRequire(new URL("../package.json", import.meta.url))
const sharp = createRequire(require.resolve("next/package.json"))("sharp")
const source = fileURLToPath(
  new URL("../public/acerca-de.webp", import.meta.url)
)
const destination = fileURLToPath(
  new URL("../public/acerca-ascii.webp", import.meta.url)
)
const columns = 160
const rows = 120
const glyphs = " .:-+ox%8@"
const pixels = await sharp(source)
  .resize(columns, rows, { fit: "fill" })
  .removeAlpha()
  .raw()
  .toBuffer()
const characters = []

for (let row = 0; row < rows; row++) {
  for (let column = 0; column < columns; column++) {
    const offset = (row * columns + column) * 3
    const luminance =
      (pixels[offset] * 0.2126 +
        pixels[offset + 1] * 0.7152 +
        pixels[offset + 2] * 0.0722) /
      255
    const glyph =
      glyphs[Math.min(glyphs.length - 1, Math.floor(luminance * glyphs.length))]
    if (glyph === " ") continue
    const color = luminance > 0.7 ? "#f4f1ec" : "#edb758"
    characters.push(
      `<text x="${column * 6}" y="${row * 8 + 7}" fill="${color}" opacity="${(0.35 + luminance * 0.65).toFixed(2)}">${glyph}</text>`
    )
  }
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="960" height="960"><rect width="960" height="960" fill="#0c0e10"/><g font-family="monospace" font-size="8">${characters.join("")}</g></svg>`
await sharp(Buffer.from(svg)).webp({ quality: 85 }).toFile(destination)
console.log("Generated public/acerca-ascii.webp from the original photograph.")
