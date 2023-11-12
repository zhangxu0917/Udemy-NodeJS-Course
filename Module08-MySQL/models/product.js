const db = require("../util/database");

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  async save() {
    return db.execute(
      "INSERT INTO products (title, imageUrl, description, price) VALUES (?, ?, ?, ?);",
      [this.title, this.imageUrl, this.description, this.price]
    );
  }

  static async fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static async findById(id) {
    return db.execute("SELECT * FROM products WHERE id = ?", [id]);
  }

  static async deleteProductById(id) {}
};
