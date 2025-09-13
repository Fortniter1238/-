const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

// Токен твоего бота
const TELEGRAM_TOKEN = "6125133441:AAGNesWT9frmL49ZmZZ6yXRP8-Rf0HxxqAU";

// Список chat_id, которые ты получил
const TELEGRAM_CHAT_IDS = [
  948828396,    // myhaas
  5047602825,   // Artemovskiyy
  1344703209    // Nazerrro
];

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(express.static("public"));

let messages = [];

io.on("connection", (socket) => {
  console.log("Пользователь подключился:", socket.id);

  socket.emit("init", messages);

  socket.on("message", async (msg) => {
    const newMsg = {
      text: msg.text,
      user: msg.user || "Гость",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    messages.push(newMsg);
    io.emit("message", newMsg);

    // Отправляем в Telegram всем chat_id
    for (const chatId of TELEGRAM_CHAT_IDS) {
      try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: chatId,
            text: `💬 ${newMsg.user}: ${newMsg.text}`
          })
        });
      } catch (err) {
        console.error("Ошибка отправки в Telegram:", err);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log("Пользователь отключился:", socket.id);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
