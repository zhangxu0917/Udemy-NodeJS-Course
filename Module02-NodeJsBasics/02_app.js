const http = require("http");
const { handler, someText } = require("./routes");

const server = http.createServer(handler);

server.listen(3000);
console.log(someText);
