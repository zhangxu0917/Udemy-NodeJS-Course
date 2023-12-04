const express = require("express");
const path = require("path");
const fs = require("fs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const cors = require("cors");
const { graphqlHTTP } = require("express-graphql");

const auth = require("./middlewares/is-auth");
const { clearImage } = require("./util/file");

const graphqlSchema = require("./graphql/schema");
const graphqlResolver = require("./graphql/resolves");

const MONGODB_URI = "mongodb://127.0.0.1:27017/messages";

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  console.log(file.mimetype);
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json()); // FIXME: for application/json

// FIXME: use multer
app.use(
  multer({
    storage: fileStorage,
    fileFilter,
  }).single("image")
);

app.use("/images", express.static(path.join(__dirname, "images")));

app.put("/post-image", (req, res, next) => {
  console.log(req.file);
  if (!req.file) {
    return res.status(200).json({
      message: "No file provided!",
    });
  }

  if (req.body.oldPath) {
    clearImage(req.body.oldPath);
  }

  return res.status(201).json({
    message: "File Stored.",
    filePath: req.file.path,
  });
});

app.use(cors());
app.use(auth);

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    customFormatErrorFn(err) {
      if (!err.originalError) {
        return err;
      }

      const data = err.originalError.data;
      const message = err.message || "An error occurred.";
      const code = err.originalError.code || 500;
      return {
        message,
        data,
        status: code,
      };
    },
  })
);

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({
    message: message,
    code: 5,
    data,
  });
});

mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    const server = app.listen(8080);
  })
  .catch((err) => {
    console.error(err);
  });
