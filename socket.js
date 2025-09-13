import { WebSocketServer } from "ws";

let wss;

export default function handler(req, res) {
  if (!res.socket.server.wss) {
    console.log("Создаем WebSocket сервер на Vercel");
    wss = new WebSocketServer({ noServer: true });
    res.socket.server.wss = wss;

    res.socket.server.on('upgrade', (req, socket, head) => {
      wss.handleUpgrade(req, socket, head, ws => {
        ws.on('message', message => {
          // Рассылаем всем клиентам
          wss.clients.forEach(client => {
            if (client.readyState === client.OPEN) {
              client.send(message.toString());
            }
          });
        });
      });
    });
  }
  res.end();
}
