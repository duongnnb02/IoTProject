const express = require('express');
const router = express.Router();
const eventsModel = require('../models/eventsModel');


router.get('/add', (req, res) => {
    res.render('add_events', { title: "Thêm thiết bị" });
})


router.get('/', async (req, res) => {
    const data = await eventsModel.find();
    res.render("index", {
        title: "Trang chủ",
        data: data
    })
})

module.exports = router;