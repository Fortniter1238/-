let messages = [];

export default function handler(req, res) {
  if (req.method === 'GET') {
    res.status(200).json(messages);
  } else if (req.method === 'POST') {
    const { text } = req.body;
    if (typeof text === 'string' && text.trim()) {
      messages.push({ text });
      if (messages.length > 100) messages = messages.slice(-100);
    }
    res.status(200).json(messages);
  } else {
    res.status(405).end();
  }
}
