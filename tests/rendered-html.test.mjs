import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders Omar's project-management-led generalist portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(
    html,
    /<title>Omar Faruque — Project Manager &amp; Cross-Functional Operator<\/title>/i,
  );
  assert.match(
    html,
    /I turn complex ideas into clear, executable projects/i,
  );
  assert.match(
    html,
    /Project management is my core discipline\. Breadth is the advantage I bring\./i,
  );
  assert.match(html, /A five-product AI roadmap/i);
  assert.match(html, /Municipal AI pilot delivery/i);
  assert.match(html, /Digital growth for SMEs/i);
  assert.match(html, /href="#main-content"[^>]*>\s*Skip to main content/i);
  assert.match(html, /<main id="main-content" tabindex="-1">/i);
  assert.match(html, /type="application\/ld\+json"/i);
  assert.match(html, /"@type":"Person"/i);
  assert.match(html, /<meta name="robots" content="index, follow"/i);
  assert.doesNotMatch(html, /Your site is taking shape|Building your site|codex-preview/i);
});

test("renders the complete navigation and contact paths", async () => {
  const response = await render();
  const html = await response.text();

  for (const target of [
    "#profile",
    "#experience",
    "#work",
    "#capabilities",
    "#contact",
  ]) {
    assert.match(html, new RegExp(`href="${target}"`));
  }

  assert.match(html, /href="mailto:omarfaruque32@gmail\.com"/i);
  assert.match(html, /href="https:\/\/www\.linkedin\.com\/in\/omarfaruquerajim"/i);
  assert.match(html, /href="\/Omar_Faruque_CV\.pdf"/i);
  assert.match(html, />136<\/strong>/);
  assert.match(html, />05<\/strong>/);
  assert.match(html, />03<\/strong>/);
});

test("ships the CV, social card, and favicon assets", async () => {
  const [pdf, socialCard, favicon] = await Promise.all([
    readFile(new URL("../public/Omar_Faruque_CV.pdf", import.meta.url)),
    readFile(new URL("../public/og.png", import.meta.url)),
    readFile(new URL("../public/favicon.svg", import.meta.url), "utf8"),
  ]);

  assert.equal(pdf.subarray(0, 4).toString(), "%PDF");
  assert.equal(socialCard.subarray(1, 4).toString(), "PNG");
  assert.match(favicon, /<svg\b/i);
});

test("publishes search-engine discovery routes", async () => {
  const [robotsResponse, sitemapResponse] = await Promise.all([
    render("/robots.txt"),
    render("/sitemap.xml"),
  ]);

  assert.equal(robotsResponse.status, 200);
  assert.match(robotsResponse.headers.get("content-type") ?? "", /text\/plain/i);
  assert.match(await robotsResponse.text(), /Sitemap: .*\/sitemap\.xml/i);

  assert.equal(sitemapResponse.status, 200);
  assert.match(sitemapResponse.headers.get("content-type") ?? "", /xml/i);
  assert.match(await sitemapResponse.text(), /<loc>https:\/\/omar-faruque-cv-2026\.rashed829489\.chatgpt\.site<\/loc>/i);
});
