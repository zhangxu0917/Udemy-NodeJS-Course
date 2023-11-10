const fs = require("fs").promises;
const path = require("path");
const rootDir = require("../util/path");

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
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

    // FIXME: if this.id exist, sence is edit product.
    if (this.id) {
      const existingProducIndext = products.findIndex(
        (prod) => prod.id === this.id
      );
      const updatedProducts = [...products];
      updatedProducts[existingProducIndext] = this;

      products = updatedProducts;
      return fs.writeFile(p, JSON.stringify(products));
    }

    this.id = Math.ceil(Math.random() * 1000000).toString();
    products.push(this);
    return fs.writeFile(p, JSON.stringify(products));
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

  static async findById(id) {
    const products = await this.fetchAll();
    const targetProd = products.find((product) => {
      return product.id === id;
    });
    return targetProd;
  }

  static async deleteProductById(id) {
    const p = path.join(rootDir, "data/products.json");
    const products = await Product.fetchAll();
    const deletedProducts = products.filter((item) => item.id !== id);
    return fs.writeFile(p, JSON.stringify(deletedProducts));
  }
};
