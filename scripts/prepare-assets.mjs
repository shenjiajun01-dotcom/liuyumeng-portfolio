import { readFile, mkdir, chmod, readdir, writeFile } from "node:fs/promises";
import { createCanvas } from "@napi-rs/canvas";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import sharp from "sharp";

const files = await readdir(".");
const source = files.find((name) => name.endsWith(".pdf"));
const portrait = files.find((name) => name.endsWith(".jpg"));
const resume = files.find((name) => name.endsWith(".pptx"));
if (!source || !portrait || !resume)
  throw new Error("Original PDF, portrait and resume are required");
await Promise.all(
  ["public/assets/pages", "public/assets/thumbs", "public/documents"].map(
    (path) => mkdir(path, { recursive: true }),
  ),
);
async function syncDocument(original, destination) {
  const content = await readFile(original);
  const existing = await readFile(destination).catch((error) => {
    if (error.code !== "ENOENT") throw error;
    return null;
  });
  if (existing) await chmod(destination, 0o666);
  if (existing?.equals(content)) return;
  await writeFile(destination, content);
  await chmod(destination, 0o666);
}
await Promise.all([
  syncDocument(source, "public/documents/liu-yumeng-portfolio.pdf"),
  syncDocument(resume, "public/documents/liu-yumeng-resume.pptx"),
  sharp(portrait)
    .resize(640, 760, { fit: "cover", position: "top" })
    .webp({ quality: 90 })
    .toFile("public/assets/portrait.webp"),
]);
const document = await getDocument({
  data: new Uint8Array(await readFile(source)),
  useSystemFonts: true,
}).promise;
const manifest = [];
for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
  const page = await document.getPage(pageNumber);
  const base = page.getViewport({ scale: 1 });
  const renderWidth = [10, 19].includes(pageNumber) ? 6000 : 2600;
  const viewport = page.getViewport({ scale: renderWidth / base.width });
  const canvas = createCanvas(
    Math.ceil(viewport.width),
    Math.ceil(viewport.height),
  );
  await page.render({
    canvas,
    canvasContext: canvas.getContext("2d"),
    viewport,
  }).promise;
  const buffer = canvas.toBuffer("image/png");
  const filename = `page-${String(pageNumber).padStart(2, "0")}.webp`;
  await sharp(buffer)
    .resize({ width: 2600 })
    .webp({ quality: 88 })
    .toFile(`public/assets/pages/${filename}`);
  await sharp(buffer)
    .resize({ width: 760 })
    .webp({ quality: 80 })
    .toFile(`public/assets/thumbs/${filename}`);
  const crops = {
    4: { name: "project-01", left: 0, top: 0, width: 0.5, height: 0.98 },
    7: { name: "project-02", left: 0.01, top: 0.02, width: 0.49, height: 0.93 },
    9: { name: "project-03", left: 0.01, top: 0.02, width: 0.49, height: 0.93 },
    11: {
      name: "project-04",
      left: 0.01,
      top: 0.02,
      width: 0.49,
      height: 0.93,
    },
    14: {
      name: "project-05",
      left: 0.51,
      top: 0.09,
      width: 0.46,
      height: 0.76,
    },
    19: {
      name: "project-06",
      left: 0.559,
      top: 0.21,
      width: 0.155,
      height: 0.61,
    },
  };
  const crop = crops[pageNumber];
  if (crop) {
    await sharp(buffer)
      .extract({
        left: Math.floor(viewport.width * crop.left),
        top: Math.floor(viewport.height * crop.top),
        width: Math.floor(viewport.width * crop.width),
        height: Math.floor(viewport.height * crop.height),
      })
      .resize({ width: 1300 })
      .webp({ quality: 88 })
      .toFile(`public/assets/${crop.name}.webp`);
  }
  if (pageNumber === 10) {
    await sharp(buffer)
      .extract({
        left: Math.floor(viewport.width * 0.533),
        top: Math.floor(viewport.height * 0.23),
        width: Math.floor(viewport.width * 0.323),
        height: Math.floor(viewport.height * 0.54),
      })
      .resize({ width: 2100 })
      .webp({ quality: 92 })
      .toFile("public/assets/hero.webp");
  }
  const dimensions = await sharp(`public/assets/pages/${filename}`).metadata();
  manifest.push({
    page: pageNumber,
    file: filename,
    width: dimensions.width,
    height: dimensions.height,
  });
  console.log(`Prepared ${pageNumber}/${document.numPages}`);
}
await writeFile(
  "public/assets/manifest.json",
  JSON.stringify(manifest, null, 2),
);
await document.destroy();
console.log("Assets prepared. Original documents are preserved.");
