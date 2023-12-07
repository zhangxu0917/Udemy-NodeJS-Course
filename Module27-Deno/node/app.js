const express = require("express");
const bodyParser = require("body-parser");

const todosRouter = require("./routes/todos");

const server = express();

app.use(bodyParser.json());

app.use("/todos", todosRouter);

server.listen(3000);
