const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios");

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

  const flowHash = "63fe0bac3516006064";
  const clientIp = req.ip;
  const landingName = "Лиды";
  // данные для отправки в POST запросе
  const postData = {
    flow_hash: flowHash,
    landing: "eagehwnrg",
    first_name: newLead.firstName,
    last_name: newLead.lastName,
    email: newLead.email,
    phone: newLead.telephone,
    ip: "93.223.752.15",
    sub1: "tetfsegfebwub_1",
    sub2: "tetfsbwfub_2",
    sub3: "teteeegegfsubwb_3",
    sub4: "tetetgeubfwb_4",
    click_id: "clbwgwyefgeick_id",
    user_agent:
      "iPhone OSy 14_3 flik Mac OS X) AppleegegWebKit/605.1.15 (KHTML, like Gecko) Version/14.0.2 Mobile/15E148 Safari/604.1",
  };
  // конфигурация запроса
  const requestConfig = {
    method: "post",
    url: "https://cryp.im/api/v1/web/conversion?api_token=RGLVDNfSZe5ccfEPsE715g2VmTDqAFyrRhbZ83C8b0pQb8XiTTUudrJtqkLn",
    headers: {
      "Content-Type": "application/json",
    },
    data: postData,
  };

  let APIResponse;
  // отправка запроса и обработка ответа
  axios(requestConfig)
    .then((response) => {
      APIResponse = response.data;
      bot.sendMessage(chatId, `Ответ от API\n\n${JSON.stringify(APIResponse)}`);
    })
    .catch((error) => {
      APIResponse = error;
      bot.sendMessage(chatId, `Ответ от API\n\n${JSON.stringify(APIResponse)}`);
    });
});
