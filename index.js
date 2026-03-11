const http = require("http")
const https = require("https")
const fs = require("fs")
const app = require("./src/app")

const isRender = !!process.env.RENDER;

const isHttps = process.env.HTTPS === "true" && !isRender;

let server;

if (isHttps) {
  const credentials = {
    key: fs.readFileSync("/var/www/html/api/https/privkey.pem"),
    cert: fs.readFileSync("/var/www/html/api/https/fullchain.pem"),
  };

  server = https.createServer(credentials, app);
} else {
  server = http.createServer(app);
}

const PORT = process.env.PORT || 4000;
const HOST = process.env.HOST || "localhost";

server.listen(PORT, () => {
  const protocol = isHttps ? "https" : "http";
  console.log(`Server running at ${protocol}://${HOST}:${PORT}`);
});