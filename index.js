import { useState, useEffect, useRef } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const fetchMessages = () => {
      fetch('/api/messages')
        .then(res => res.json())
        .then(data => setMessages(data));
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input })
    });
    if (res.ok) {
      setInput('');
      const data = await res.json();
      setMessages(data);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: '40px auto', fontFamily: 'sans-serif' }}>
      <h2>Чат для переписки</h2>
      <div style={{ border: '1px solid #ccc', padding: 10, height: 300, overflowY: 'auto', background: '#fafafa' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ margin: '8px 0' }}>
            <span style={{ background: '#e0e0e0', borderRadius: 4, padding: '4px 8px' }}>{msg.text}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', marginTop: 10 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          style={{ flex: 1, padding: 8, fontSize: 16 }}
          placeholder="Введите сообщение..."
        />
        <button type="submit" style={{ marginLeft: 8, padding: '8px 16px', fontSize: 16 }}>Отправить</button>
      </form>
    </div>
  );
}
