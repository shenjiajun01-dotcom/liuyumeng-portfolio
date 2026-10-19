import { test } from "node:test";
import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import sharp from "sharp";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

test("all 19 PDF spreads have full-size and thumbnail assets", async () => {
  const manifest = JSON.parse(
    await readFile("public/assets/manifest.json", "utf8"),
  );
  assert.equal(manifest.length, 19);
  for (const entry of manifest) {
    const full = await stat(`public/assets/pages/${entry.file}`);
    const thumb = await stat(`public/assets/thumbs/${entry.file}`);
    assert.ok(full.size > 1000);
    assert.ok(thumb.size < full.size);
  }
});

test("chapter 04 points to PDF page 11 and print pages 18-19", async () => {
  const document = await getDocument({
    data: new Uint8Array(
      await readFile("public/documents/liu-yumeng-portfolio.pdf"),
    ),
  }).promise;
  assert.equal(document.numPages, 19);
  const page = await document.getPage(11);
  const content = await page.getTextContent();
  assert.match(content.items.map((item) => item.str ?? "").join(" "), /1 9/);
  const image = await sharp("public/assets/pages/page-11.webp").metadata();
  assert.ok(image.width >= 2500);
  await document.destroy();
});

test("hero, portrait and original documents are available", async () => {
  for (const path of [
    "public/assets/hero.webp",
    "public/assets/portrait.webp",
    "public/documents/liu-yumeng-portfolio.pdf",
    "public/documents/liu-yumeng-resume.pptx",
  ]) {
    assert.ok((await stat(path)).size > 1000);
  }
});
