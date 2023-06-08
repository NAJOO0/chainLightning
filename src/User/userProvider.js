const userDao = require("./userDao");
const { pool } = require("../../config/database");
const errorResponse = require("../../utils/errorHandling/errorResponse");
const responseMessage = require("../../utils/response/responseMessage");

exports.getUserById = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const user = await userDao.getUserById(connection, userId);
    return user;
  } catch (err) {
    console.log(err);
    throw new errorResponse(responseMessage.DB_ERROR);
  } finally {
    connection.release();
  }
};
exports.getUserCouponById = async function (userId, couponId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const userCoupon = await userDao.getUserCouponById(
      connection,
      userId,
      couponId
    );
    return userCoupon;
  } catch (err) {
    console.log(err);
    throw new errorResponse(responseMessage.DB_ERROR);
  } finally {
    connection.release();
  }
};
