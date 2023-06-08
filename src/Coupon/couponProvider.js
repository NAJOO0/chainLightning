const couponDao = require("./couponDao");
const { pool } = require("../../config/database");
const errorResponse = require("../../utils/errorHandling/errorResponse");
const responseMessage = require("../../utils/response/responseMessage");

exports.getCouponList = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  try {
    const couponListResult = await couponDao.getCouponList(connection, userId);
    return couponListResult;
  } catch (err) {
    console.log(err);
    throw new errorResponse(responseMessage.DB_ERROR);
  } finally {
    connection.release();
  }
};
