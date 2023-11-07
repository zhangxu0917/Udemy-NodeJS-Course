const http = require("http");
const express = require("express");

const app = express();
const server = http.createServer(app);

app.use((req, res, next) => {
  console.log("In the middleware!");
  next(); // FIXME: Allows the request to continue to the next middleware in line.
});

app.use((req, res, next) => {
  console.log("In another middleware!");
  res.send("<h1>Hello from ExpressJS!</h1>");
});

server.listen(3000);
