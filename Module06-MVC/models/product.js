const fs = require("fs").promises;
const path = require("path");
const rootDir = require("../util/path");

module.exports = class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  async save() {
    const p = path.join(rootDir, "data/products.json");
    let productsData;
    let products = [];

    try {
      productsData = await fs.readFile(p);
      products = JSON.parse(productsData);
    } catch (error) {
      console.error(error);
    }

    try {
      products.push(this);
      await fs.writeFile(p, JSON.stringify(products));
    } catch (error) {
      console.error(error);
    }
  }

  static async fetchAll() {
    let products = [];
    try {
      const productsData = await fs.readFile(
        path.join(rootDir, "data/products.json")
      );
      products = JSON.parse(productsData);
    } catch (error) {
      console.error(error);
    }
    return products;
  }
};
