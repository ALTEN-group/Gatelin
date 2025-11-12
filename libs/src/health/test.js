const http = require("node:http");

const { PORT } = process.env;

const options = {
  host: "localhost",
  port: PORT,
  path: "/health",
  method: "GET",
  timeout: 2000,
};

const request = http.request(options, (res) => {
  if (res.statusCode === 200) process.exit(0);
  else process.exit(1);
});

request.on("error", (err) => {
  process.exit(1);
});

request.end();
