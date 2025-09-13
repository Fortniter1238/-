import { Server } from "socket.io";

let messages = [];

export default function handler(req, res) {
  if (!res.socket.server.io) {
    console.log("Запуск Socket.IO сервера...");
    const io = new Server(res.socket.server, {
      path: "/api/socket_io",
      addTrailingSlash: false
    });

    io.on("connection", (socket) => {
      console.log("Пользователь подключился");

      // Отправляем историю сообщений
      socket.emit("init", messages);

      // Получаем новое сообщение
      socket.on("message", (msg) => {
        const newMsg = { text: msg, time: new Date().toLocaleTimeString() };
        messages.push(newMsg);
        io.emit("message", newMsg); // отправляем всем
      });

      socket.on("disconnect", () => {
        console.log("Пользователь отключился");
      });
    });

    res.socket.server.io = io;
  }
  res.end();
}
