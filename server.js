const express = require("express");
const app = express();
const port = 3000;

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Lead = require("./models/lead");

const TelegramBot = require("node-telegram-bot-api");
const TOKEN = "6293734740:AAGawDvGqmbibwlmg89u551yBdGyV8oUNfE";

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/thanks.html", (req, res) => {
  res.sendFile(__dirname + "/thanks.html");
});


app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

const mongoURL =
  "mongodb+srv://maanukyaan:Vahe_2004@leads.in2i5rw.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log("Connected to MongoDB succesfully!");
  })
  .catch((err) => {
    console.log(err);
  });

// Creating data schema
const leadsSchema = {
  firstName: String,
  lastName: String,
  email: String,
  telephone: String,
};

app.post("/", function (req, res) {
  let { firstName, lastName, email, telephone } = req.body;
  let newLead = new Lead({
    firstName,
    lastName,
    email,
    telephone,
  });

  newLead.save();

  const bot = new TelegramBot(TOKEN, { polling: true });
  const chatId = 885172606;
  bot.sendMessage(
    chatId,
    `НОВЫЙ ЛИД!\n\nИмя: ${newLead.firstName}\nФамилия: ${newLead.lastName}\nE-mail: ${newLead.email}\nНомер телефона: ${newLead.telephone}`
  );

  res.redirect("/thanks.html");
});
