import { chromium } from "playwright";
import assert from "node:assert/strict";
import { mkdir, writeFile } from "node:fs/promises";

const browser = await chromium.launch({ channel: "chrome", headless: true });
const baseURL = process.env.TEST_URL ?? "http://localhost:5173";
const results = [];
await mkdir("test-results", { recursive: true });

try {
  for (const viewport of [
    { width: 1440, height: 1000 },
    { width: 834, height: 1112 },
    { width: 390, height: 844 },
    { width: 320, height: 740 },
  ]) {
    const context = await browser.newContext({
      viewport,
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    const errors = [];
    const pdfRequests = [];
    page.on("pageerror", (error) => errors.push(error.message));
    page.on("response", (response) => {
      if (response.status() >= 400)
        errors.push(`${response.status()} ${response.url()}`);
    });
    page.on("request", (request) => {
      if (request.url().endsWith(".pdf")) pdfRequests.push(request.url());
    });
    await page.goto(baseURL, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    assert.equal(await page.title(), "刘雨朦 | 环境与景观设计作品集");
    assert.equal(await page.locator(".project").count(), 6);
    assert.equal(
      pdfRequests.length,
      0,
      "Initial page must not request the original PDF",
    );
    await page.locator(".hero-image").evaluate((image) => {
      if (!image.complete || !image.naturalWidth)
        throw new Error("Hero image not rendered");
    });
    await page.screenshot({ path: `test-results/hero-${viewport.width}.png` });

    for (const section of [
      "#work",
      "#about",
      "#experience",
      ".awards-section",
      "#contact",
    ]) {
      await page.locator(section).scrollIntoViewIfNeeded();
    }
    const overflow = await page.evaluate(() => ({
      viewport: innerWidth,
      document: document.documentElement.scrollWidth,
    }));
    assert.ok(
      overflow.document <= overflow.viewport + 1,
      `Horizontal overflow at ${viewport.width}: ${JSON.stringify(overflow)}`,
    );
    const portraitRatio = await page
      .locator(".portrait-wrap > img")
      .evaluate((image) => {
        const bounds = image.getBoundingClientRect();
        return bounds.width / bounds.height;
      });
    assert.ok(
      portraitRatio > 0.75 && portraitRatio < 0.9,
      "Portrait must preserve a natural aspect ratio",
    );
    const brokenImages = await page
      .locator("img")
      .evaluateAll((images) =>
        images
          .filter((image) => image.complete && image.naturalWidth === 0)
          .map((image) => image.src),
      );
    assert.deepEqual(brokenImages, []);

    await page.getByRole("button", { name: "景观更新", exact: true }).click();
    await page.waitForFunction(
      () => document.querySelectorAll(".project").length === 3,
    );
    await page.getByRole("button", { name: /全部作品/ }).click();
    await page.waitForFunction(
      () => document.querySelectorAll(".project").length === 6,
    );

    await page.getByRole("button", { name: /浏览全部跨页/ }).click();
    assert.equal(await page.locator(".archive-grid button").count(), 19);
    await page
      .getByRole("button", { name: "查看作品集 PDF 第 19 页", exact: true })
      .click();
    await page.locator("dialog").waitFor({ state: "visible" });
    await page.locator(".reader-image.is-loaded").waitFor();
    assert.ok(
      (await page.locator(".reader-image").getAttribute("src")).includes(
        "page-19.webp",
      ),
    );
    await page.getByRole("button", { name: "上一页", exact: true }).click();
    await page.locator(".reader-image.is-loaded").waitFor();
    assert.ok(
      (await page.locator(".reader-image").getAttribute("src")).includes(
        "page-18.webp",
      ),
    );
    await page.keyboard.press("ArrowRight");
    await page.locator(".reader-image.is-loaded").waitFor();
    assert.ok(
      (await page.locator(".reader-image").getAttribute("src")).includes(
        "page-19.webp",
      ),
    );
    await page.keyboard.press("Escape");
    await page.locator("dialog").waitFor({ state: "detached" });
    await page.getByRole("button", { name: /收起全部跨页/ }).click();

    await page.getByRole("button", { name: /查看相关作品/ }).click();
    assert.equal(await page.locator("#sangeng-project").count(), 1);
    assert.ok(
      (
        await page.locator(".internship-preview img").getAttribute("src")
      ).includes("page-11.webp"),
    );
    await page
      .getByRole("button", {
        name: "打开第04部分：大徐江岸新屋景观改造",
        exact: true,
      })
      .click();
    await page.locator(".reader-image.is-loaded").waitFor();
    assert.equal(
      await page.locator(".reader-chapter").textContent(),
      "CHAPTER 04",
    );
    assert.ok(
      (await page.locator(".reader-image").getAttribute("src")).includes(
        "page-11.webp",
      ),
    );
    assert.equal(
      await page
        .getByRole("button", { name: "上一页", exact: true })
        .isDisabled(),
      true,
    );
    assert.equal(
      await page
        .getByRole("button", { name: "下一页", exact: true })
        .isDisabled(),
      true,
    );
    await page.getByRole("button", { name: "放大作品", exact: true }).click();
    assert.equal(await page.locator(".reader-zoom>span").textContent(), "150%");
    await page.getByRole("button", { name: "缩小作品", exact: true }).click();
    assert.equal(await page.locator(".reader-zoom>span").textContent(), "100%");
    await page.waitForFunction(
      () => getComputedStyle(document.querySelector("dialog")).opacity === "1",
    );
    await page.screenshot({
      path: `test-results/reader-${viewport.width}.png`,
    });
    await page
      .getByRole("button", { name: "关闭作品预览", exact: true })
      .click();
    await page.locator("dialog").waitFor({ state: "detached" });
    assert.equal(await page.evaluate(() => document.body.style.overflow), "");

    if (viewport.width < 768) {
      await page.getByRole("button", { name: "打开导航", exact: true }).click();
      await page
        .locator("#main-navigation")
        .getByRole("link", { name: "关于我", exact: true })
        .click();
      assert.equal(
        await page
          .getByRole("button", { name: "打开导航", exact: true })
          .getAttribute("aria-expanded"),
        "false",
      );
    }

    await page.getByRole("button", { name: /查看相关作品/ }).click();
    await page.locator("#home").scrollIntoViewIfNeeded();
    await page.screenshot({
      path: `test-results/full-${viewport.width}.png`,
      fullPage: true,
    });
    assert.deepEqual(errors, [], `Browser errors at ${viewport.width}`);
    assert.equal(
      pdfRequests.length,
      0,
      "Image previews must not fetch the original PDF",
    );
    results.push({
      viewport,
      passed: true,
      initialPDFRequests: pdfRequests.length,
      errors,
    });
    console.log(
      `PASS ${viewport.width}px: filters, 19 spreads, chapter 04, zoom, keyboard, responsive layout`,
    );
    await context.close();
  }
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
  });
  const page = await context.newPage();
  await page.goto(baseURL, { waitUntil: "networkidle" });
  await page
    .getByRole("button", { name: "查看面传真情作品详情", exact: true })
    .click();
  await page.locator(".reader-image.is-loaded").waitFor();
  await page.keyboard.press("Tab");
  const focusedInDialog = await page.evaluate(() =>
    Boolean(document.activeElement.closest("dialog")),
  );
  assert.equal(focusedInDialog, true, "Modal must contain keyboard focus");
  await page.keyboard.press("Escape");
  await page.locator("dialog").waitFor({ state: "detached" });
  const pdfResponse = await page.request.get(
    `${baseURL}/documents/liu-yumeng-portfolio.pdf`,
    { headers: { Range: "bytes=0-1023" } },
  );
  assert.ok([200, 206].includes(pdfResponse.status()));
  assert.equal((await pdfResponse.body()).subarray(0, 4).toString(), "%PDF");
  const resumeResponse = await page.request.get(
    `${baseURL}/documents/liu-yumeng-resume.pptx`,
    { headers: { Range: "bytes=0-1023" } },
  );
  assert.ok([200, 206].includes(resumeResponse.status()));
  assert.equal((await resumeResponse.body()).subarray(0, 2).toString(), "PK");
  console.log(
    "PASS normal-motion modal focus and original PDF/PPTX document endpoints",
  );
  await context.close();
  await writeFile(
    "test-results/browser-report.json",
    JSON.stringify(results, null, 2),
  );
} finally {
  await browser.close();
}
