import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("");

  const sendMessage = async () => {
    if (!message.trim()) return;
    try {
      const res = await axios.post("/api/sendMessage", { text: message });
      setStatus(res.data.ok ? "Отправлено!" : "Ошибка");
      setMessage("");
    } catch (err) {
      setStatus("Ошибка при отправке");
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Мой Telegram Web Lite</h1>
      <textarea
        rows="3"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Введите сообщение..."
        style={{ width: "100%", marginBottom: 10 }}
      />
      <br />
      <button onClick={sendMessage}>Отправить</button>
      <p>{status}</p>
    </div>
  );
}
