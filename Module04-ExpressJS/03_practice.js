const http = require("http");
const Express = require("express");

const app = Express();

app.use("/users", (req, res, next) => {
  res.send(`
          <h1>Users</h1>
          <ul>
              <li>Sam</li>
              <li>John</li>
          </ul>
      `);
});

app.use("/", (req, res, next) => {
  res.send("<h1>Hello from Express</h1>");
});

const server = http.createServer(app);

server.listen(3000);
 