const expect = require("chai").expect;
const mongoose = require("mongoose");

const User = require("../models/user");
const FeedController = require("../controllers/feed");

const MONGODB_URI = "mongodb://127.0.0.1:27017/test-messages";

describe("Feed Controller", () => {
  before((done) => {
    mongoose
      .connect(MONGODB_URI)
      .then((result) => {
        const user = new User({
          email: "test@test.com",
          password: "admin123",
          name: "Max",
          posts: [],
          _id: "65632cb7c2c5cc55a1e1c19e",
        });
        return user.save();
      })
      .then(() => {
        done();
      });
  });

  after((done) => {
    User.deleteMany({})
      .then(() => {
        return mongoose.disconnect();
      })
      .then(() => {
        done();
      });
  });

  it("Should add a created post to the posts of the creator", (done) => {
    const req = {
      body: {
        title: "Test Post 01",
        content: "A Test Post",
      },
      file: {
        path: "abc",
      },
      userId: "65632cb7c2c5cc55a1e1c19e",
    };

    const res = {
      status() {
        return this;
      },
      json() {},
    };

    console.log(FeedController.createPost(req, res, () => {}));

    FeedController.createPost(req, res, () => {}).then((savedUser) => {
      expect(savedUser).to.have.property("posts");
      expect(savedUser.posts).to.have.length(1);
      done();
    });
  });
});
