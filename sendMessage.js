import axios from "axios";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { text } = req.body;
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  try {
    const tgRes = await axios.post(
      `https://api.telegram.org/bot${token}/sendMessage`,
      {
        chat_id: chatId,
        text
      }
    );
    res.status(200).json({ ok: tgRes.data.ok });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
}
