const couponProvider = require("./couponProvider");
const responseMessage = require("../../utils/response/responseMessage");
const resultResponse = require("../../utils/response/resultResponse");
const asyncHandler = require("../../utils/errorHandling/asyncHandler");
const { response } = require("express");
/**
 * API Name:거래 요청
 * [GET] /app/coupons
 * author:나주영
 */
exports.getCouponList = asyncHandler(async function (req, res) {
  const couponList = await couponProvider.getCouponList(req.userId);
  return res.status(200).json(
    resultResponse(responseMessage.SUCCESS_GET_COUPON_LIST, {
      couponList: couponList,
    })
  );
});
