exports.getUserById = async function (connection, userId) {
  const getUserByIdQuery = `
        SELECT u.id,u.name,up.point
        FROM User u LEFT JOIN UserPoint up ON u.id = up.user_id
        WHERE id = ?;
    `;
  const getUserByIdParams = [userId];
  const userRows = await connection.query(getUserByIdQuery, getUserByIdParams);
  return userRows[0];
};
exports.getUserCouponById = async function (connection, userId, couponId) {
  const getUserCouponByIdQuery = `
            SELECT uc.status,c.id,c.name,c.discount_rate,c.discount_price,c.expiredAt
            FROM UserCoupon uc LEFT JOIN Coupon c ON uc.coupon_id = c.id
            WHERE user_id = ? AND coupon_id = ?;
        `;
  const getUserCouponByIdParams = [userId, couponId];
  const userCouponRows = await connection.query(
    getUserCouponByIdQuery,
    getUserCouponByIdParams
  );
  return userCouponRows[0];
};
exports.updateUserPoint = async function (connection, userId, point) {
  const updateUserPointQuery = `
            UPDATE UserPoint
            SET point = ?
            WHERE user_id = ?;
        `;
  const updateUserPointParams = [point, userId];
  await connection.query(updateUserPointQuery, updateUserPointParams);
};
exports.savePayment = async function (connection, paymentInfo) {
  const savePaymentQuery = `
                INSERT INTO PaymentHistory (user_id,pay_type_id,pay_method,total_price,coupon_id,discount_price,payment_price,createdAt,approvedAt)
                VALUES (?,?,?,?,?,?,?,?,?);
            `;
  const savePaymentParams = paymentInfo;
  await connection.query(savePaymentQuery, savePaymentParams);
};
exports.updateUserCouponStatus = async function (
  connection,
  userId,
  couponId,
  status
) {
  const updateUserCouponStatusQuery = `
                    UPDATE UserCoupon
                    SET status = ?
                    WHERE user_id = ? AND coupon_id = ?;
                `;
  const updateUserCouponStatusParams = [status, userId, couponId];
  await connection.query(
    updateUserCouponStatusQuery,
    updateUserCouponStatusParams
  );
};
