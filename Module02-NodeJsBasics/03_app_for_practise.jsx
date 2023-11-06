const http = require("http");

const users = [];

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  console.log(url, method);

  if (url === "/") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write(`<head><title>NodeJS Practice</title></head>`);
    res.write(`<body>
            <h1>Hello From NodeJS Server</h1>
            <a href="/">Home</a>
            <a href="/users">Users</a>

            <form method="POST" action="/create-user">
                <input type="text" name="username"/>
                <button type="submit">Submit</button>
            </form>
        </body>`);

    res.write("</html>");
    return res.end();
  }

  if (url === "/users") {
    res.setHeader("Content-Type", "text/html");
    res.write("<html>");
    res.write(`<head><title>NodeJS Practice</title></head>`);
    console.log(users);
    res.write(`<body>
            <h1>User List</h1>
            <a href="/">Home</a>
            <a href="/users">Users</a>

            <ul>
                ${users
                  .map((user) => {
                    return `<li>${user}</li>`;
                  })
                  .join("\n")}
            </ul>
        </body>`);
    return res.end();
  }

  if (url === "/create-user" && method === "POST") {
    const requestData = [];

    req.on("data", (chunk) => {
      requestData.push(chunk);
    });

    req.on("end", () => {
      const parsedBody = Buffer.concat(requestData).toString();
      console.log(parsedBody);
      const username = parsedBody.split("=")[1];
      console.log(`username`, username);
      users.push(username);

      res.statusCode = 302;
      res.setHeader("Location", "/");
      return res.end();
    });
  }
};

const server = http.createServer(requestHandler);

server.listen(3000);
