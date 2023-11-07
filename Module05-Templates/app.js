const http = require("http");
const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const adminData = require("./routes/admin");
const shopRouter = require("./routes/shop");

app.set("view engine", "pug");
app.set("views", "views");

app.use("/admin", adminData.router);
app.use(shopRouter);

const server = http.createServer(app);

server.listen(3000);
