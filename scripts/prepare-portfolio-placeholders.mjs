import { createRequire } from "node:module"
import { writeFile } from "node:fs/promises"
import { fileURLToPath } from "node:url"

const require = createRequire(new URL("../package.json", import.meta.url))
const sharp = createRequire(require.resolve("next/package.json"))("sharp")
const directory = new URL("../public/placeholders/", import.meta.url)
const ids = [1015, 1018, 1039, 1043, 1044]
const sources = []
for (const id of ids) {
  const infoResponse = await fetch(`https://picsum.photos/id/${id}/info`)
  if (!infoResponse.ok)
    throw new Error(`Metadata ${id}: ${infoResponse.status}`)
  const metadata = await infoResponse.json()
  const source = `https://picsum.photos/id/${id}/1200/900`
  const response = await fetch(source)
  if (!response.ok) throw new Error(`Image ${id}: ${response.status}`)
  const buffer = Buffer.from(await response.arrayBuffer())
  const file = `photo-${id}.webp`
  await sharp(buffer)
    .webp({ quality: 80 })
    .toFile(fileURLToPath(new URL(file, directory)))
  sources.push({
    file,
    source,
    author: metadata.author,
    original: metadata.url,
    purpose: "Temporary illustrative placeholder, not a product screenshot",
  })
  console.log(`Prepared ${file}`)
}
await writeFile(
  new URL("sources.json", directory),
  `${JSON.stringify(sources, null, 2)}\n`
)
