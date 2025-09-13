import { useEffect, useState } from "react";

// Случайный цвет для пользователя
const getRandomColor = () => {
  const colors = ["#ff7f50", "#1e90ff", "#32cd32", "#ff69b4", "#ffa500"];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Генерируем случайное имя для сессии
const randomName = "User" + Math.floor(Math.random() * 1000);

export default function Home() {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const socket = new WebSocket("wss://" + window.location.host);
    socket.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      setMessages(prev => [...prev, msg]);
    };
    setWs(socket);
  }, []);

  const sendMessage = () => {
    if (ws && text.trim() !== "") {
      const messageObj = {
        user: randomName,
        color: getRandomColor(),
        text: text.trim()
      };
      ws.send(JSON.stringify(messageObj));
      setText("");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20, fontFamily: "Arial" }}>
      <h1>Chotogram</h1>
      <div style={{
        border: "1px solid #ccc",
        padding: 10,
        minHeight: 300,
        marginBottom: 10,
        overflowY: "auto",
        display: "flex",
        flexDirection: "column",
        gap: 5
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            backgroundColor: msg.color,
            color: "#fff",
            padding: "5px 10px",
            borderRadius: 10,
            alignSelf: msg.user === randomName ? "flex-end" : "flex-start",
            maxWidth: "70%",
            wordBreak: "break-word"
          }}>
            <b>{msg.user}:</b> {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Написать сообщение..."
        style={{ width: "80%", marginRight: 10, padding: 5 }}
      />
      <button onClick={sendMessage} style={{ padding: "5px 10px" }}>Отправить</button>
    </div>
  );
}
