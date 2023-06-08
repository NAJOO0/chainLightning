const userService = require("./userService");
const userProvider = require("./userProvider");
const responseMessage = require("../../utils/response/responseMessage");
const resultResponse = require("../../utils/response/resultResponse");
const asyncHandler = require("../../utils/errorHandling/asyncHandler");
const kakaoPay = require("../../utils/kakaoPayment/kakaoPay");
/**
 * API Name:거래 요청
 * [POST] /app/users/pay/kakao
 * author:나주영
 */
exports.pay = asyncHandler(async function (req, res) {
  const { payMethod, userId, totalPrice, discountPrice, couponId } = {
    payMethod: null,
    userId: 1,
    totalPrice: 20000,
    discountPrice: 5000,
    couponId: 1,
  };
  const payCreatedAt = new Date();
  //유저가 있는지 - 포인트 정보도 같이 가져옴
  const user = await userProvider.getUserById(userId);
  if (user.length === 0) {
    return res.status(400).json(responseMessage.NOT_FOUND_USER);
  }
  //결제에 쿠폰 사용했는지
  if (couponId !== null) {
    //유저의 쿠폰이 있는지
    const userCoupon = await userProvider.getUserCouponById(userId, couponId);
    if (userCoupon.length === 0) {
      return res.status(400).json(responseMessage.NOT_FOUND_COUPON);
    }
    //유저의 쿠폰이 사용 가능한지
    if (userCoupon[0].status === 1) {
      return res.status(400).json(responseMessage.ALREADY_USED_COUPON);
    }
    //유저의 쿠폰이 만료되었는지
    if (userCoupon[0].status === 2) {
      return res.status(400).json(responseMessage.EXPIRED_COUPON);
    }
    //만료되었는데 반영이 안되었으면
    if (userCoupon[0].expriedAt < new Date()) {
      await userService.updateUserCouponStatus(userId, couponId, 2);
      return res.status(400).json(responseMessage.EXPIRED_COUPON);
    }
    //할인이 잘 적용되었눈지
    if (userCoupon[0].discount_rate !== 0) {
      if ((totalPrice * userCoupon[0].discount_rate) / 100 !== discountPrice) {
        return res.status(400).json(responseMessage.WRONG_DISCOUNT_RATE);
      }
    } else {
      if (userCoupon[0].discount_price !== discountPrice) {
        return res.status(400).json(responseMessage.WRONG_DISCOUNT_PRICE);
      }
    }
  }
  const paymentPrice = totalPrice - discountPrice;
  //   다 통과되면 결제 진행
  //   포인트로 결제
  if (payMethod === "point") {
    const pointBeforePayment = 45000;
    //보유한 포인트가 실제 보유 포인트와 같은지
    if (pointBeforePayment !== user[0].point) {
      return res.status(400).json(responseMessage.WRONG_POINT);
    }
    const pointAfterPayment = pointBeforePayment - paymentPrice;
    //포인트 결제 후 포인트가 0보다 작으면 에러
    if (pointAfterPayment < 0) {
      return res.status(400).json(responseMessage.SHORT_OF_POINT);
    }
    //포인트 결제 후 유저 포인트 업데이트
    await userService.updateUserPoint(userId, pointAfterPayment);
    //쿠폰 사용 처리
    if (couponId !== 0) {
      await userService.updateUserCouponStatus(userId, couponId, 1);
    }
    //결제 내역 저장
    await userService.savePayment([
      userId,
      2,
      payMethod,
      totalPrice,
      couponId,
      discountPrice,
      paymentPrice,
      payCreatedAt,
      new Date(),
    ]);
    return res.status(200).json(responseMessage.SUCCESS_PAYMENT);
  }
  //   paymentMethod에 따라 포인트면 바로 결제 하고 카드면 유저 결제 정보를 가져와서 결제 API 호출
  const result = await kakaoPay.requestKaKaoPay({
    pay_type: 0,
    cid: "TC0ONETIME",
    partner_order_id: "partner_order_id",
    partner_user_id: "partner_user_id",
    item_name: "ChargeFee",
    quantity: 1,
    total_amount: paymentPrice,
    tax_free_amount: 0,
  });
  req.session.tid = result.tid;
  req.session.userId = userId;
  req.session.couponId = couponId;
  req.session.totalPrice = totalPrice;
  req.session.discountPrice = discountPrice;
  return res.status(200).json(
    resultResponse(responseMessage.SUCCESS_REQUEST_PAYMENT, {
      next_redirect_pc_url: result.next_redirect_pc_url,
    })
  );
});
/**
 * API Name:선불금 충전
 * [POST] /app/users/charge-point
 * author:나주영
 */
exports.chargePoint = asyncHandler(async function (req, res) {
  const userId = 1;
  const price = 10000;
  const user = await userProvider.getUserById(userId);
  if (user.length === 0) {
    return res.status(400).json(responseMessage.NOT_FOUND_USER);
  }
  const result = await kakaoPay.requestKaKaoPay({
    pay_type: 1,
    cid: "TC0ONETIME",
    partner_order_id: "partner_order_id",
    partner_user_id: "partner_user_id",
    item_name: "ChargeFee",
    quantity: 1,
    total_amount: price,
    tax_free_amount: 0,
  });
  req.session.tid = result.tid;
  req.session.userId = userId;
  req.session.userPoint = user[0].point;
  return res.status(200).json(
    resultResponse(responseMessage.SUCCESS_REQUEST_PAYMENT, {
      next_redirect_pc_url: result.next_redirect_pc_url,
    })
  );
});
/**
 * API Name:결제 요청 성공
 * [GET] /app/users/approve/pay/:pg_token
 * query string : pg_token
 * pg_token은 카카오페이 결제 성공 후 redirect_url의 parmams로 전달 받는다.
 * author:나주영
 */
exports.approvePayment = asyncHandler(async function (req, res) {
  const { pg_token } = req.query;
  const result = await kakaoPay.approveKaKaoPay(pg_token, req.session.tid);
  await userService.savePayment([
    req.session.userId,
    2,
    result.payment_method_type,
    req.session.totalPrice,
    req.session.couponId,
    req.session.discountPrice,
    result.amount.total,
    result.created_at,
    result.approved_at,
  ]);
  if (req.session.couponId !== 0) {
    await userService.updateUserCouponStatus(
      req.session.userId,
      req.session.couponId,
      1
    );
  }
  return res.status(200).json(responseMessage.SUCCESS_PAYMENT);
});
/**
 * API Name:포인트 충전 결제 요청 성공
 * [GET] /app/users/approve/pay/charge-point/:pg_token
 * query string : pg_token
 * pg_token은 카카오페이 결제 성공 후 redirect_url의 parmams로 전달 받는다.
 * author:나주영
 */
exports.approvePaymentToChargePoint = asyncHandler(async function (req, res) {
  const { pg_token } = req.query;
  const result = await kakaoPay.approveKaKaoPay(pg_token, req.session.tid);
  await userService.savePayment([
    req.session.userId,
    1,
    result.payment_method_type,
    result.amount.total,
    null,
    0,
    result.amount.total,
    result.created_at,
    result.approved_at,
  ]);
  await userService.updateUserPoint(
    req.session.userId,
    req.session.userPoint + result.amount.total
  );
  return res.status(200).json(responseMessage.SUCCESS_CHARGE_POINT);
});
/**
 * API Name: 보유 포인트 조회
 * [GET] /app/users/point
 * author:나주영
 */
exports.getPoint = asyncHandler(async function (req, res) {
  const user = await userProvider.getUserById(req.userId);
  if (user.length === 0) {
    return res.status(400).json(responseMessage.NOT_FOUND_USER);
  }
  return res.status(200).json(
    resultResponse(responseMessage.SUCCESS_GET_POINT, {
      point: user[0].point,
    })
  );
});
