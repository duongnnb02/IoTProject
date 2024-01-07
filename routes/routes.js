const express = require("express");
const router = express.Router();
const Events = require("../models/eventsModel");
const Users = require("../models/user");
const bcrypt = require("bcrypt");

router.get("/home", async (req, res) => {
  const { user } = req.session;
  const data = await Events.find();
  res.render("home", {
    title: "Trang chủ",
    data: data,
    userName: user.name,
  });
});

router.get("/", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", async (req, res) => {
  const user = {
    name: req.body.username,
    password: req.body.password,
  };
  //check if user already exist
  const existingUser = await Users.findOne({ name: user.name });
  if (existingUser) {
    console.error("Tài khoản đã tồn tại. Hãy chọn tên tài khoản khác");
  } else {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword;
    const userData = await Users.insertMany(user);
    res.redirect("/");
    console.log(userData);
  }
});

router.post("/login", async (req, res) => {
  try {
    const user = await Users.findOne({ name: req.body.username });
    if (!user) {
      console.error("Tài khoản không tồn tại");
    }
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (isPasswordMatch) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      return req.session.save((err) => {
        console.log(err);
        res.redirect("/home");
      });
    } else {
      console.error("Sai mật khẩu");
    }
  } catch {
    res.send("Wrong Details");
  }
});

router.post("/logout", async (req, res) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
});

module.exports = router;
