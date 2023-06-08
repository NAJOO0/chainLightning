exports.getCouponList = async function (connection, userId) {
  const getCouponListQuery = `
    SELECT c.id,uc.status,c.name,c.discount_price,c.discount_rate,c.expiredAt
    FROM UserCoupon uc LEFT JOIN Coupon c ON uc.coupon_id = c.id
    WHERE uc.user_id = ?
    `;
  const [couponListRows] = await connection.query(getCouponListQuery, userId);
  return couponListRows;
};
