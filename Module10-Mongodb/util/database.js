const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect("mongodb://root:admin@127.0.0.1:27017")
    .then((client) => {
      console.log("Connected!");
      _db = client.db("shop");
      callback(client);
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};

module.exports.mongoConnect = mongoConnect;
module.exports.getDb = getDb;
