require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongDbStore = require("connect-mongodb-session")(session);
const mqtt = require("mqtt");
const shortId = require("shortid");
const path = require("path");
const bcrypt = require("bcrypt");
const moment = require('moment');

const Events = require("./models/eventsModel");
const Users = require("./models/user");
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");
const topic = "esp8266/dht11";
const app = express();
const PORT = process.env.PORT || 4000;

const store = new MongDbStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

//database connection
mongoose.connect(process.env.MONGO_URI);
const db = mongoose.connection;
db.on("connected", async () => {
  console.log("MongoDb connected");
});

// MongoDB Connection Fail
db.on("error", async (err) => {
  console.log("Error connecting MongoDb", err);
});

//mqtt connection
client.on("connect", async () => {
  console.log("MQTT connect!");
  client.subscribe(topic);
});

//mqtt receiving data
client.on("message", async (topic, message) => {
  console.log(
    "\n[MQTT Received] Topic:",
    topic,
    ", Message:",
    message.toString()
  );
  let data = message.toString();
  data = JSON.parse(data);
  data.created = moment();
  data._id = shortId.generate();
  // Save live data into database
  await saveData(data);
});

saveData = async (data) => {
  data = new Events(data);
  data = await data.save();
  console.log("Saved data:", data);
};

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(
  session({
    secret: "my secret key",
    saveUninitialized: false,
    resave: false,
    store: store,
  })
);

app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("", require("./routes/routes"));

app.listen(PORT, () => {
  console.log(`htpp://localhost:${PORT}`);
});
