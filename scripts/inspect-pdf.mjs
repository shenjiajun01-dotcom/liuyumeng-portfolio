import { readFile, mkdir, writeFile, readdir } from "node:fs/promises";
import { createCanvas } from "@napi-rs/canvas";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import sharp from "sharp";

const source = (await readdir(".")).find((name) => name.endsWith(".pdf"));
if (!source) throw new Error("Missing source PDF");
const document = await getDocument({
  data: new Uint8Array(await readFile(source)),
  useSystemFonts: true,
}).promise;
await mkdir(".source", { recursive: true });
const pages = [];
const thumbnails = [];
for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
  const page = await document.getPage(pageNumber);
  const text = await page.getTextContent();
  const viewport = page.getViewport({
    scale: 360 / page.getViewport({ scale: 1 }).width,
  });
  const canvas = createCanvas(
    Math.ceil(viewport.width),
    Math.ceil(viewport.height),
  );
  await page.render({
    canvas,
    canvasContext: canvas.getContext("2d"),
    viewport,
  }).promise;
  const thumb = await sharp(canvas.toBuffer("image/png"))
    .resize(360, 270, { fit: "contain", background: "#e8e8e8" })
    .jpeg()
    .toBuffer();
  thumbnails.push({
    input: thumb,
    left: ((pageNumber - 1) % 4) * 360,
    top: Math.floor((pageNumber - 1) / 4) * 270,
  });
  const content = {
    page: pageNumber,
    width: viewport.width,
    height: viewport.height,
    text: text.items.map((item) => item.str ?? "").join(" "),
  };
  pages.push(content);
  console.log(`PAGE ${pageNumber}: ${content.text}`);
}
await writeFile(".source/pdf-index.json", JSON.stringify(pages, null, 2));
await sharp({
  create: {
    width: 1440,
    height: Math.ceil(document.numPages / 4) * 270,
    channels: 3,
    background: "#e8e8e8",
  },
})
  .composite(thumbnails)
  .jpeg({ quality: 85 })
  .toFile(".source/overview.jpg");
console.log(
  `Indexed ${document.numPages} pages. Contact sheet: .source/overview.jpg`,
);
await document.destroy();
