module.exports = function (app) {
  const coupon = require("./couponController");
  const loginMiddleware = require("../../middlewares/loginMiddleware");

  app.get("/api/coupons/:userId", loginMiddleware, coupon.getCouponList);
};
