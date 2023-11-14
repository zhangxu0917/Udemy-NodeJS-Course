const { ObjectId } = require("mongodb");

const { getDb } = require("../util/database");

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this.id = new ObjectId(id); //
  }

  async save() {
    const db = getDb();
    try {
      await db.collection("users").insertOne(this);
    } catch (error) {
      console.error(error);
    }
  }

  async addToCart(product) {
    const cartProductIndex = this.cart?.items?.findIndex((cp) => {
      // FIXME: 两个id Object 可以使用equals方法进行比较
      return cp.productId.equals(product._id);
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= -1) {
      newQuantity = this.cart?.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updateCart = {
      items: updatedCartItems,
    };

    const db = getDb();
    return db.collection("users").updateOne(
      { _id: this.id },
      {
        $set: {
          cart: updateCart,
        },
      }
    );
  }

  async getCart() {
    const db = getDb();
    const productIds = this.cart.items.map((i) => {
      return i.productId;
    });
    return db
      .collection("products")
      .find({
        _id: { $in: productIds },
      })
      .toArray()
      .then((products) => {
        return products.map((prod) => {
          return {
            ...prod,
            quantity:
              this.cart.items.find((i) => {
                return i.productId.equals(prod._id);
              })?.quantity || 0,
          };
        });
      });
  }

  async deleteItemFromCart(prodId) {
    const updatedCartItems = this.cart.items.filter(
      (item) => item.productId.equals(new ObjectId(prodId)) === false
    );

    const db = getDb();
    return db.collection("users").updateOne(
      {
        id: this._id,
      },
      {
        $set: {
          cart: {
            items: updatedCartItems,
          },
        },
      }
    );
  }

  async addOrder() {
    const db = getDb();
    const cartProducts = await this.getCart();
    const order = {
      items: cartProducts,
      user: {
        _id: this.id,
        name: this.name,
      },
    };
    await db.collection("orders").insertOne(order);
    this.cart = { items: [] };
    db.collection("users").updateOne(
      {
        id: this._id,
      },
      {
        $set: {
          cart: { items: [] },
        },
      }
    );
  }

  async getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({
        "user._id": this.id,
      })
      .toArray();
  }

  static async findById(id) {
    const db = getDb();
    try {
      const user = await db
        .collection("users")
        .findOne({ _id: new ObjectId(id) });
      return user;
    } catch (error) {}
  }
}

module.exports = User;
