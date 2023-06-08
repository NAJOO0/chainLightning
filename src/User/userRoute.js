module.exports = function (app) {
  const user = require("./userController");
  const loginMiddleware = require("../../middlewares/loginMiddleware");
  app.get("/api/users/pay/:userId", loginMiddleware, user.pay);
  app.get("/api/users/charge-point", loginMiddleware, user.chargePoint);
  app.get("/api/users/approve/payment", user.approvePayment);
  app.get(
    "/api/users/approve/payment/charge-point",
    user.approvePaymentToChargePoint
  );
  app.get("/api/users/point/:userId", loginMiddleware, user.getPoint);
};
