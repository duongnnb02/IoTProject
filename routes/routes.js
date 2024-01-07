const express = require('express');
const router = express.Router();
const Events = require('../models/eventsModel');
const Users = require('../models/user');
const bcrypt = require('bcrypt');

router.get('/login', async (req, res) => {
     const data = await eventsModel.find();
     res.render("index", {
         title: "Trang chủ",
         data: data
    })
})

router.get('/', (req, res) => {
    res.render("login");
})

router.get("/signup", (req, res) => {
    res.render("signup");
})

router.post("/signup", async (req, res) => {
    const user = {
        name: req.body.username,
        password: req.body.password
    }
    //check if user already exist
    const existingUser = await Users.findOne({ name: user.name });
    if (existingUser) {
        console.error("Tài khoản đã tồn tại. Hãy chọn tên tài khoản khác");
    } else {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(user.password, saltRounds);
        user.password = hashedPassword;
        const userData = await Users.insertMany(user);
        res.render("login");
        console.log(userData);
    }
})

router.post("/login", async (req, res) => {
    try {
        const check = await Users.findOne({name: req.body.username});
        if (!check) {
            console.error("Tài khoản không tồn tại");
        }
        const isPasswordMatch = await bcrypt.compare(req.body.password, check.password);
        if (isPasswordMatch){
            res.render("index");
        } else {
            console.error("Sai mật khẩu");
        }
    } catch {
        res.send("Wrong Details");
    }
})

module.exports = router;