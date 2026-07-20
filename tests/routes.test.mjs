import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { createServer } from "node:net";
import test from "node:test";

async function availablePort() {
  const server = createServer();
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  const address = server.address();
  const port = typeof address === "object" && address ? address.port : 0;
  await new Promise((resolve) => server.close(resolve));
  return port;
}

async function waitForServer(url, child) {
  for (let attempt = 0; attempt < 60; attempt += 1) {
    if (child.exitCode !== null) {
      throw new Error(`Next.js exited before becoming ready (${child.exitCode})`);
    }
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {
      // The server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error("Next.js did not become ready in time");
}

test("serves fresh and established prototype routes", { timeout: 30_000 }, async (context) => {
  const port = await availablePort();
  const child = spawn(
    process.execPath,
    ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", String(port)],
    { cwd: new URL("..", import.meta.url), stdio: "ignore" },
  );
  context.after(() => child.kill("SIGTERM"));

  const origin = `http://127.0.0.1:${port}`;
  await waitForServer(origin, child);

  const fresh = await fetch(origin);
  assert.equal(fresh.status, 200);
  assert.match(await fresh.text(), /Start with one spot/);

  const established = await fetch(`${origin}/demo`);
  assert.equal(established.status, 200);
  assert.match(await established.text(), /Good morning, Maya/);
});
