require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");
const { TOKEN, WEATHER_API_KEY } = process.env;

var arr = Array(60)
  .fill(null)
  .map(() => Array(0));

const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const date = msg.date;

  var myDate = new Date(date * 1000);
  var newdate = myDate.toLocaleString();
  index1 = newdate.indexOf(":");
  index2 = newdate.lastIndexOf(":");
  newdate = parseInt(newdate.substring(index1 + 1, index2));

  arr[newdate].push(chatId);

  let weather = await getCurrentWeather();
  bot.sendMessage(
    chatId,
    `Welcome!  Current Delhi Temperature is ${weather} \u00B0 Celsius. We will update you every hour. `
  );
});

const sendMessageToUser = async () => {
  setInterval(async () => {
    let weather = await getCurrentWeather();
    // console.log(weather);
    var currentDa = new Date();
    var nowTime = new Date(currentDa.getTime());
    var Cminute = nowTime.getMinutes();

    arr[Cminute].forEach(sendmessage);
    function sendmessage(item) {
      bot.sendMessage(
        item,
        ` Current Delhi Temperature is ${weather} \u00B0 Celsius.`
      );
    }
  }, 1000 * 60);
};

const app = express();
app.use(bodyParser.json());

let getCurrentWeather = async function () {
  return await axios
    .get(
      `https://api.openweathermap.org/data/2.5/weather?q=delhi&appid=${WEATHER_API_KEY}`
    )
    .then((res) => {
      let number = parseInt(res.data.main.temp) - 273;
      return number.toFixed(2);
    });
};

app.listen(process.env.PORT || 8000, async () => {
  console.log("app running on port,", process.env.PORT || 8000);
  sendMessageToUser();
});
