const expect = require("chai").expect;
const sinon = require("sinon");
const mongoose = require("mongoose");

const User = require("../models/user");
const AuthCOntroller = require("../controllers/auth");

const MONGODB_URI = "mongodb://127.0.0.1:27017/test-messages";

describe("Auth Controller - Login", () => {
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

  it("should throw an error with code 500 if accessing the database fails", (done) => {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "123@test.com",
        password: "admin123",
      },
    };

    AuthCOntroller.login(req, {}, () => {}).then((result) => {
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
      done();
    });

    // expect(AuthCOntroller.login);
    User.findOne.restore();
  });

  it("Should send a response with a valid user status for an existing uesr", (done) => {
    const req = { userId: "65632cb7c2c5cc55a1e1c19e" };
    const res = {
      statusCode: 500,
      userStatus: null,
      status(code) {
        this.statusCode = code;
        return this;
      },
      json(data) {
        this.userStatus = data.status;
      },
    };
    AuthCOntroller.getUserStatus(req, res, () => {}).then(() => {
      expect(res.statusCode).to.be.equal(200);
      expect(res.userStatus).to.be.equal("I am new!");
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

  //   beforeEach()
  //   afterEach()
});
