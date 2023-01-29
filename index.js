require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const TelegramBot = require("node-telegram-bot-api");
const { TOKEN, WEATHER_API_KEY } = process.env;

var arr = Array(60)
  .fill(null)
  .map(() => Array(0));

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(TOKEN, { polling: true });

// Matches "/echo [whatever]"
// bot.onText(/\/echo (.+)/, (msg, match) => {
//   // 'msg' is the received Message from Telegram
//   // 'match' is the result of executing the regexp above on the text content
//   // of the message

//   const chatId = msg.chat.id;
//   const resp = match[1]; // the captured "whatever"

//   // send back the matched "whatever" to the chat
//   bot.sendMessage(chatId, resp);
// });

// Listen for any kind of message. There are different kinds of
// messages.
bot.onText(/\/start/, async (msg) => {
  // console.log(msg);
  const chatId = msg.chat.id;
  const date = msg.date;

  var myDate = new Date(date * 1000);
  var newdate = myDate.toLocaleString();
  index1 = newdate.indexOf(":");
  index2 = newdate.lastIndexOf(":");
  newdate = parseInt(newdate.substring(index1 + 1, index2));

  arr[newdate].push(chatId);
  // console.log(arr[newdate]);
  let weather = await getCurrentWeather();
  bot.sendMessage(
    chatId,
    `Welcome!  Current Delhi Temperature is ${weather} \u00B0 Celsius. We will update you every hour. `
  );
});

const sendMessageToUser = async () => {
  // let weather = await getCurrentWeather();
  // console.log(weather);
  setInterval(async () => {
    let weather = await getCurrentWeather();
    // console.log(weather);
    var currentDa = new Date();
    var nowTime = new Date(currentDa.getTime());
    var Cminute = nowTime.getMinutes();
    console.log(Cminute);

    arr[Cminute].forEach(sendmessage);
    function sendmessage(item) {
      bot.sendMessage(
        item,
        ` Current Delhi Temperature is ${weather} \u00B0 Celsius.`
      );
    }
  }, 1000 * 60);
  console.log();
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

//   from: {
//     id: 1041539086,
//     is_bot: false,
//     first_name: 'Vishal',
//     language_code: 'en'
//   },
//   chat: { id: 1041539086, first_name: 'Vishal', type: 'private' },
//   date: 1674944153,
//   text: 'Cb'
// }
