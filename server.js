const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static("public"));

let messages = [];

io.on("connection", (socket) => {
  console.log("Пользователь подключился");

  // Отправляем историю сообщений
  socket.emit("init", messages);

  // Получаем новое сообщение
  socket.on("message", (msg) => {
    const newMsg = { text: msg.text, user: msg.user, time: new Date().toLocaleTimeString() };
    messages.push(newMsg);
    io.emit("message", newMsg); // отправляем всем
  });

  socket.on("disconnect", () => {
    console.log("Пользователь отключился");
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
