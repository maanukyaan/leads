const express = require("express");
const app = express();
const port = 3000;
const axios = require("axios");

const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const Lead = require("./models/lead");

const TelegramBot = require("node-telegram-bot-api");

// Сюда вставляется токен, который сгенерировал @BotFather
const TOKEN = "6025083700:AAHmeb-w3F-dReCRkjSCMIiCFJJwCFT3JI8";
// Сюда вставляется ваш чат айди (можно узнать свой через @getmyid_bot)
const chatID = 6223969469;

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

// Сюда вставляется ссылка, полученная из MongoDB
const mongoURL =
  "mongodb+srv://arkadijnenov:ntYMHvc3yio673uB@leads.awgcxvp.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(mongoURL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then((res) => {
    console.log("Connected to MongoDB succesfully!");
  })
  .catch((err) => {
    console.log(err);
  });

app.post("/", function (req, res) {
  const id = Math.floor(Math.random() * 10000000);
  const currentUrl = req.protocol + "://" + req.hostname + req.originalUrl;
  const { firstName, lastName, email, telephone } = req.body;
  const ip = req.headers["x-forwarded-for"] || req.ip;
  const userAgent = req.headers["user-agent"];
  const newLead = new Lead({
    id,
    currentUrl,
    firstName,
    lastName,
    email,
    telephone,
    ip,
    userAgent,
  });

  newLead.save();

  const bot = new TelegramBot(TOKEN, { polling: true });
  bot.sendMessage(
    chatID,
    `
    НОВЫЙ ЛИД!\n\n
    ID: ${newLead.id}\n
    Сайт: ${newLead.currentUrl}\n
    Имя: ${newLead.firstName}\n
    Фамилия: ${newLead.lastName}\n
    E-mail: ${newLead.email}\n
    Номер телефона: ${newLead.telephone}\n
    IP: ${newLead.ip}\n
    User Agent: ${newLead.userAgent}
    `
  );
  // отправляем клиента на страницу "Спасибо"
  res.redirect("/thanks.html");

  const flowHash = "63fe0bac3516006064";
  // данные для отправки в POST запросе
  const postData = {
    flow_hash: flowHash,
    landing: newLead.userAgent,
    first_name: newLead.firstName,
    last_name: newLead.lastName,
    email: newLead.email,
    phone: newLead.telephone,
    ip: newLead.ip,
    sub1: "test_1",
    sub2: "test_2",
    sub3: "test_3",
    sub4: "test_4",
    click_id: "click_id",
    user_agent: newLead.userAgent,
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
      bot.sendMessage(chatID, `Ответ от API\n\n${JSON.stringify(APIResponse)}`);
    })
    .catch((error) => {
      APIResponse = error;
      bot.sendMessage(chatID, `Ответ от API\n\n${JSON.stringify(APIResponse)}`);
    });
});
