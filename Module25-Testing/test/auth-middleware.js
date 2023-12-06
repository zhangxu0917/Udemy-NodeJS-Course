const expect = require("chai").expect;
const jwt = require("jsonwebtoken");
const sinon = require("sinon");

const authMiddleware = require("../middlewares/is-auth");

describe("Auth middleware", () => {
  it("should throw an error if no authorization header is present", () => {
    const req = {
      get(headerName) {
        return null;
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw(
      "Not authenticated."
    );
  });

  it("should throw an error if the authorization header is only one string", () => {
    const req = {
      get(headerName) {
        return "xyz";
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should throw an error if the token cannot be verified", () => {
    const req = {
      get(headerName) {
        return "Bearer xyz";
      },
    };

    expect(authMiddleware.bind(this, req, {}, () => {})).to.throw();
  });

  it("should yield a userId after decoding the token", () => {
    const req = {
      get(headerName) {
        return "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTYzMmNiN2MyYzVjYzU1YTFlMWMxOWUiLCJlbWFpbCI6Im1heEB0ZXN0LmNvbSIsImlhdCI6MTcwMTY1NzMyMCwiZXhwIjoxNzAxNjY4MTIwfQ.FtUvcyiSzcFMIgZFGE6sPNNKhpgz2xbjZcsDWT0zkew";
      },
    };

    sinon.stub(jwt, "verify");
    jwt.verify.returns({
      userId: "abc",
    });

    authMiddleware(req, {}, () => {});

    expect(req).to.have.property("userId");
    expect(jwt.verify.called).to.be.true;
    jwt.verify.restore();
  });
});
