const fs = require("fs");
const path = require("path");

const requestHandler = (req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === "/") {
    res.write("<html>");
    res.write(`<head>
              <title>Enter Message</title>
              </head>`);
    res.write(`<body>
              <form method="POST" action="/message">
              <input type="text" name="message"/>
              <button type="submit">Submit</button>
              </form>
          </body>`);
    res.write("</html");
    return res.end();
  }

  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log("chunk", chunk);
      body.push(chunk);
    });

    req.on("end", () => {
      const parsedBody = Buffer.concat(body).toString();
      console.log("parsedBody", parsedBody);
      const message = parsedBody.split("=")[1];

      fs.writeFile(path.join(__dirname, "message.tex"), (err) => {
        console.error(err);
        res.statusCode = 302;
        res.setHeader("Location", "/");
        return res.end();
      });
    });
  }

  res.setHeader("Content-Type", "text/html");
  res.write(`<html>`);
  res.write(`<head><title>My First Page</title></head>`);
  res.write(`<body><h1>Hello from my Node.js Server!</h1></body>`);
  res.write(`</html>`);
  res.end();
};

// module.exports = {
//   handler: requestHandler,
//   someText: "Some hard coded text",
// };

// module.exports.handler = requestHandler;
// module.exports.someText = "Some hard coded text";

exports.handler = requestHandler;
exports.someText = "Some hard coded text";
