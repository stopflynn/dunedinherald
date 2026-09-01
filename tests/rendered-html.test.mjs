import assert from "node:assert/strict";
import { once } from "node:events";
import { spawn } from "node:child_process";
import test, { after, before } from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
let serverProcess;
let baseUrl;

before(async () => {
  serverProcess = spawn(process.execPath, ["server.mjs"], {
    cwd: projectRoot,
    env: {
      ...process.env,
      PORT: "0",
      SANITY_PROJECT_ID: "",
      SANITY_READ_TOKEN: "",
      SITE_ACCESS_PASSWORD: "",
      SITE_ACCESS_COOKIE_SECRET: "",
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let output = "";
  const ready = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Timed out waiting for the production server.\n${output}`));
    }, 30_000);

    function inspect(chunk) {
      output += chunk.toString();
      const match = output.match(/Ready on http:\/\/0\.0\.0\.0:(\d+)/);
      if (match) {
        clearTimeout(timeout);
        resolve(`http://127.0.0.1:${match[1]}`);
      }
    }

    serverProcess.stdout.on("data", inspect);
    serverProcess.stderr.on("data", inspect);
    serverProcess.once("exit", (code, signal) => {
      clearTimeout(timeout);
      reject(new Error(`Production server exited before it was ready (${code ?? signal}).\n${output}`));
    });
    serverProcess.once("error", reject);
  });

  baseUrl = await ready;
});

after(async () => {
  if (!serverProcess || serverProcess.exitCode !== null) return;
  serverProcess.kill("SIGTERM");
  await once(serverProcess, "exit");
});

async function render(path = "/") {
  return fetch(`${baseUrl}${path}`, { headers: { accept: "text/html" } });
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
  assert.match(html, /Coming Soon/i);
  assert.match(html, /type="password"/i);
  assert.match(html, /action="\/api\/access"/i);
});
