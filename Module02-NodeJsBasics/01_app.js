const http = require("http");

const server = http.createServer((req, res) => {
  // console.log(req);
  console.log("req.url:", req.url);
  console.log("req.method", req.method);
  console.log("req.headers", req.headers);
  // process.exit();

  // set a response header
  res.setHeader("Content-Type", "text/html");
  res.write(`<html>`);
  res.write(`<head><title>My First Page</title></head>`);
  res.write(`<body><h1>Hello from my Node.js Server!</h1></body>`);
  res.write(`</html>`);
  res.end();
});

server.listen(3000);
