import { useEffect, useState } from "react";

export default function Home() {
  const [ws, setWs] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const socket = new WebSocket("wss://" + window.location.host);
    socket.onmessage = (event) => {
      setMessages(prev => [...prev, event.data]);
    };
    setWs(socket);
  }, []);

  const sendMessage = () => {
    if (ws && text.trim() !== "") {
      ws.send(text);
      setText("");
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <h1>Chotogram</h1>
      <div style={{ border: "1px solid #ccc", padding: 10, minHeight: 300, marginBottom: 10, overflowY: "auto" }}>
        {messages.map((msg, i) => (
          <div key={i}>{msg}</div>
        ))}
      </div>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Написать сообщение..."
        style={{ width: "80%", marginRight: 10 }}
      />
      <button onClick={sendMessage}>Отправить</button>
    </div>
  );
}
