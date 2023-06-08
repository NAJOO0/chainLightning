const userDao = require("./userDao");
const { pool } = require("../../config/database");
const errorResponse = require("../../utils/errorHandling/errorResponse");
const responseMessage = require("../../utils/response/responseMessage");

exports.updateUserPoint = async function (userId, point) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const updateUserPointResult = await userDao.updateUserPoint(
      connection,
      userId,
      point
    );
    connection.release();
    return updateUserPointResult;
  } catch (err) {
    throw new errorResponse(responseMessage.DB_ERROR);
  } finally {
    connection.release();
  }
};
exports.updateUserCouponStatus = async function (userId, couponId, status) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const updateUserCouponStatusResult = await userDao.updateUserCouponStatus(
      connection,
      userId,
      couponId,
      status
    );
    connection.release();
    return updateUserCouponStatusResult;
  } catch (err) {
    throw new errorResponse(responseMessage.DB_ERROR);
  } finally {
    connection.release();
  }
};
exports.savePayment = async function (paymentInfo) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const savePaymentResult = await userDao.savePayment(
      connection,
      paymentInfo
    );
    connection.release();
    return savePaymentResult;
  } catch (err) {
    console.log(err);
    throw new errorResponse(responseMessage.DB_ERROR);
  } finally {
    connection.release();
  }
};
