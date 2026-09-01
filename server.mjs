import { createServer } from "node:http";
import next from "next";

const port = Number.parseInt(process.env.PORT || "3000", 10);
const hostname = "0.0.0.0";

if (!Number.isInteger(port) || port < 0 || port > 65_535) {
  throw new Error("PORT must be an integer between 0 and 65535");
}

const app = next({ dev: false, hostname, port });
const handle = app.getRequestHandler();

await app.prepare();

const server = createServer(async (request, response) => {
  try {
    await handle(request, response);
  } catch (error) {
    console.error("Request failed", error);
    if (!response.headersSent) response.statusCode = 500;
    response.end("Internal server error");
  }
});

server.listen(port, hostname, () => {
  const address = server.address();
  const listeningPort = typeof address === "object" && address ? address.port : port;
  console.log(`Ready on http://${hostname}:${listeningPort}`);
});

function shutdown(signal) {
  console.log(`Received ${signal}; shutting down`);
  server.close((error) => {
    if (error) {
      console.error("Shutdown failed", error);
      process.exitCode = 1;
    }
  });
}

process.once("SIGTERM", () => shutdown("SIGTERM"));
process.once("SIGINT", () => shutdown("SIGINT"));
