import { useEffect, useState } from "react";
import { io } from "socket.io-client";

let socket;

export default function Home() {
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket = io({ path: "/api/socket_io" });

    socket.on("init", (msgs) => setChat(msgs));
    socket.on("message", (newMsg) => {
      setChat((prev) => [...prev, newMsg]);
    });

    return () => socket.disconnect();
  }, []);

  const sendMessage = () => {
    if (msg.trim()) {
      socket.emit("message", msg);
      setMsg("");
    }
  };

  return (
    <div className="chat-container">
      <div className="messages">
        {chat.map((m, i) => (
          <div key={i} className="message">
            <span>{m.text}</span>
            <small>{m.time}</small>
          </div>
        ))}
      </div>
      <div className="input-area">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          placeholder="Введите сообщение..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage}>➤</button>
      </div>
    </div>
  );
}
