import assert from "node:assert/strict";
import { once } from "node:events";
import { spawn } from "node:child_process";
import test, { after, before } from "node:test";
import { fileURLToPath } from "node:url";

const projectRoot = fileURLToPath(new URL("..", import.meta.url));
let serverProcess;
let baseUrl;
let protectedServerProcess;
let protectedBaseUrl;

function startServer(environment = {}) {
  const child = spawn(process.execPath, ["server.mjs"], {
    cwd: projectRoot,
    env: {
      ...process.env,
      PORT: "0",
      SANITY_PROJECT_ID: "",
      SANITY_READ_TOKEN: "",
      SITE_ACCESS_PASSWORD: "",
      SITE_ACCESS_COOKIE_SECRET: "",
      ...environment,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });

  let output = "";
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      reject(new Error(`Timed out waiting for the production server.\n${output}`));
    }, 30_000);

    function inspect(chunk) {
      output += chunk.toString();
      const match = output.match(/Ready on http:\/\/0\.0\.0\.0:(\d+)/);
      if (match) {
        clearTimeout(timeout);
        resolve({ child, url: `http://127.0.0.1:${match[1]}` });
      }
    }

    child.stdout.on("data", inspect);
    child.stderr.on("data", inspect);
    child.once("exit", (code, signal) => {
      clearTimeout(timeout);
      reject(new Error(`Production server exited before it was ready (${code ?? signal}).\n${output}`));
    });
    child.once("error", reject);
  });
}

before(async () => {
  const publicServer = await startServer();
  serverProcess = publicServer.child;
  baseUrl = publicServer.url;

  const protectedServer = await startServer({
    SITE_ACCESS_PASSWORD: "test-password-123",
    SITE_ACCESS_COOKIE_SECRET: "test-cookie-secret-1234567890-abcdef",
  });
  protectedServerProcess = protectedServer.child;
  protectedBaseUrl = protectedServer.url;
});

after(async () => {
  const processes = [serverProcess, protectedServerProcess].filter(
    (child) => child && child.exitCode === null,
  );
  for (const child of processes) child.kill("SIGTERM");
  await Promise.all(processes.map((child) => once(child, "exit")));
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

test("keeps access redirects on the visitor's current domain", async () => {
  const form = new FormData();
  form.set("returnTo", "/story/terrified-bakery-kosmos?edition=preview");

  const response = await fetch(`${baseUrl}/api/access`, {
    method: "POST",
    body: form,
    redirect: "manual",
  });

  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "/story/terrified-bakery-kosmos?edition=preview");
  assert.doesNotMatch(response.headers.get("location") ?? "", /0\.0\.0\.0|20011/);
});

test("a correct password sets access and redirects without exposing the hosting port", async () => {
  const form = new FormData();
  form.set("password", "test-password-123");
  form.set("returnTo", "/story/terrified-bakery-kosmos");

  const response = await fetch(`${protectedBaseUrl}/api/access`, {
    method: "POST",
    body: form,
    redirect: "manual",
  });

  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "/story/terrified-bakery-kosmos");
  assert.match(response.headers.get("set-cookie") ?? "", /dh_site_access=/);
  assert.doesNotMatch(response.headers.get("location") ?? "", /0\.0\.0\.0|20011/);
});

test("rejects external access return URLs", async () => {
  const form = new FormData();
  form.set("returnTo", "/\\\\attacker.example/path");

  const response = await fetch(`${baseUrl}/api/access`, {
    method: "POST",
    body: form,
    redirect: "manual",
  });

  assert.equal(response.status, 303);
  assert.equal(response.headers.get("location"), "/");
});
