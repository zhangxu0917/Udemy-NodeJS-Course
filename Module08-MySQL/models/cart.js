const fs = require("fs").promises;
const path = require("path");
const rootDir = require("../util/path");
const Product = require("../models/product");

const p = path.join(rootDir, "data/cart.json");

module.exports = class Cart {
  static async addProduct(id, productPrice) {
    let cart = { products: [], totalPrice: 0 };

    try {
      const cartData = await fs.readFile(p);
      cart = JSON.parse(cartData);
    } catch (error) {
      console.log(error);
    }

    // Analyze the cart => find existing product
    const existingProductIndex = cart.products.findIndex(
      (product) => product.id === id
    );

    const existingProduct = cart.products[existingProductIndex];

    let updateProduct;
    // Add new product / increase quantity;
    if (existingProduct) {
      updateProduct = { ...existingProduct };
      updateProduct.qty = updateProduct.qty + 1;
      cart.products = [...cart.products];
      cart.products[existingProductIndex] = updateProduct;
    } else {
      updateProduct = { id: id, qty: 1 };
      cart.products = [...cart.products, updateProduct];
    }

    cart.totalPrice = (Number(cart.totalPrice) + Number(productPrice)).toFixed(
      2
    );
    return fs.writeFile(p, JSON.stringify(cart));
  }

  static async getCart() {
    let productList = [];
    try {
      productList = await Product.fetchAll();
    } catch (error) {
      console.error(error);
    }

    try {
      let cartData = await fs.readFile(p);
      let cartObj = JSON.parse(cartData);

      let cartProducts = cartObj.products.map((cartProdItem) => {
        let product;
        productList.forEach((prodItem) => {
          if (cartProdItem.id === prodItem.id) {
            product = {
              ...prodItem,
              ...cartProdItem,
            };
          }
        });
        return product;
      });

      cartObj.products = cartProducts;
      return cartObj;
    } catch (error) {
      console.log(error);
    }
  }

  static async deleteProduct(id, productPrice) {
    let cart = { products: [], totalPrice: 0 };

    try {
      let cartData = await fs.readFile(p);
      cart = JSON.parse(cartData);
    } catch (error) {
      console.error(error);
    }

    const product = cart.products.find((item) => {
      return item.id === id;
    });
    cart.products = cart.products.filter((item) => {
      return item.id !== id;
    });

    if (product) {
      const cost = product.qty * productPrice;
      cart.totalPrice = (cart.totalPrice - cost).toFixed(2);
    }

    return fs.writeFile(p, JSON.stringify(cart));
  }
};
