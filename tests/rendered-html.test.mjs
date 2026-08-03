import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the publication homepage", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>The Dunedin Herald — Ōtepoti satire<\/title>/i);
  assert.match(html, /The Dunedin Herald/);
  assert.match(html, /Alternative truths/);
  assert.match(html, /Terrified/);
  assert.match(html, /Latest headlines/);
  assert.match(html, /\/og\.png/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|react-loading-skeleton/i);
});

test("server-renders a complete article", async () => {
  const response = await render("/story/terrified-bakery-kosmos");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /bakery owner trying to nail pie recipe/i);
  assert.match(html, /final, terrifying phase/i);
  assert.match(html, /This is satire/i);
  assert.match(html, /Dunedin Herald Editorial/i);
});

test("returns a real 404 for an unknown story", async () => {
  const response = await render("/story/not-a-real-story");
  assert.equal(response.status, 404);
});

test("renders the private-edition password form", async () => {
  const response = await render("/access");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /The presses are under wraps/i);
  assert.match(html, /type="password"/i);
  assert.match(html, /action="\/api\/access"/i);
});
