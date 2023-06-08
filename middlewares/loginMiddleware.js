module.exports = function (req, res, next) {
  //jwt 등 로그인을 확인하는 검증 절차를 거친 후 req.user에 해당 유저의 정보를 넣은 후 next()를 호출한다.
  console.log("loginMiddleware");
  req.userId = req.params.userId;
  next();
};
