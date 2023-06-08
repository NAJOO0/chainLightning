const axios = require("axios");
const requestKaKaoPay = async (payInfo) => {
  let addUrl = "";
  if (payInfo.pay_type === 1) {
    addUrl = "/charge-point";
  }
  const requestResult = await axios.post(
    "https://kapi.kakao.com/v1/payment/ready",
    {
      cid: payInfo.cid,
      partner_order_id: payInfo.partner_order_id,
      partner_user_id: payInfo.partner_user_id,
      item_name: payInfo.item_name,
      quantity: payInfo.quantity,
      total_amount: payInfo.total_amount,
      tax_free_amount: payInfo.tax_free_amount,
      approval_url: `http://localhost:3000/api/users/approve/payment${addUrl}`,
      cancel_url: `http://localhost:3000/api/users/cancle/payment${addUrl}`,
      fail_url: `http://localhost:3000/api/users/fail/payment${addUrl}`,
      //available_cards: ["kakaopay", "samsung", "lotte"],
      //payment_method_type: "CARD",
      //install_month: 0,
      //custom_json: { test: "custom_json" },
    },
    {
      headers: {
        Authorization: `KakaoAK ${process.env.SERVICE_APP_ADMIN_KEY}`,
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );
  return requestResult.data;
};
const approveKaKaoPay = async (pg_token, tid) => {
  const requestResult = await axios.post(
    "https://kapi.kakao.com/v1/payment/approve",
    {
      cid: "TC0ONETIME",
      tid: tid,
      partner_order_id: "partner_order_id",
      partner_user_id: "partner_user_id",
      pg_token: pg_token,
    },
    {
      headers: {
        Authorization: `KakaoAK ${process.env.SERVICE_APP_ADMIN_KEY}`,
        "Content-type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }
  );
  return requestResult.data;
};
module.exports = {
  requestKaKaoPay,
  approveKaKaoPay,
};
