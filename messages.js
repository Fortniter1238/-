import { supabase } from '../../lib/supabaseClient';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });
    if (error) return res.status(500).json({ error: error.message });
    res.status(200).json(data || []);
  } else if (req.method === 'POST') {
    const { text } = req.body;
    if (typeof text === 'string' && text.trim()) {
      const { error } = await supabase
        .from('messages')
        .insert([{ text }]);
      if (error) return res.status(500).json({ error: error.message });
    }
    const { data } = await supabase
      .from('messages')
      .select('*')
      .order('created_at', { ascending: true });
    res.status(200).json(data || []);
  } else {
    res.status(405).end();
  }
}
