const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express(); // ← создаём app сразу
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" }
});

// Отдаём статические файлы
app.use(express.static("public"));

// Хранилище сообщений в памяти
let messages = [];

// Обработка подключений
io.on("connection", (socket) => {
  console.log("Пользователь подключился:", socket.id);

  socket.emit("init", messages);

  socket.on("message", (msg) => {
    const newMsg = {
      text: msg.text,
      user: msg.user || "Гость",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };
    messages.push(newMsg);
    io.emit("message", newMsg);
  });

  socket.on("disconnect", () => {
    console.log("Пользователь отключился:", socket.id);
  });
});

// Render передаёт порт через переменную окружения
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Сервер запущен на порту ${PORT}`));
