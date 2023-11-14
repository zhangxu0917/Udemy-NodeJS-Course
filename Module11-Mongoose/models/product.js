const { getDb } = require("../util/database");
// FIXME:
const { ObjectId } = require("mongodb");

class Product {
  constructor(title, price, description, imageUrl, id, userId) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new ObjectId(id) : undefined;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;

    if (this._id) {
      // FIXME: update
      dbOp = db.collection("products").updateOne(
        { _id: this._id },
        {
          $set: this,
        }
      );
    } else {
      // FIXME: create
      dbOp = db.collection("products").insertOne(this);
    }

    dbOp
      .then((result) => {
        console.log(result);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  static async fetchAll() {
    try {
      const db = getDb();

      const products = await db.collection("products").find().toArray();
      return products;
    } catch (error) {
      console.error(error);
    }
  }

  static async findById(prodId) {
    try {
      const db = getDb();

      const product = await db.collection("products").findOne({
        // FIXME:
        _id: new ObjectId(prodId),
      });

      return product;
    } catch (error) {
      console.error(error);
    }
  }

  static async deleteById(prodId) {
    const db = getDb();
    try {
      await db.collection("products").deleteOne({
        _id: new ObjectId(prodId),
      });
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = Product;
