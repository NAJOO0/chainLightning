const express = require("express");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv").config();
const userRoute = require("./src/User/userRoute");
const couponRoute = require("./src/Coupon/couponRoute");
const errorHandler = require("./utils/errorHandling/errorHandler");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 30, // 쿠키 유효기간
    },
  })
);

//Route
userRoute(app);
couponRoute(app);

app.use((req, res, next) => {
  console.log(req.url, req.method);
  return res.status(404).send("요청하신 경로는 없는 경로입니다.");
});
//Error Handler
app.use(errorHandler);
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
