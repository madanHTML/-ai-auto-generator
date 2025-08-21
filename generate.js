import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { topic } = req.body;
  if (!topic) {
    return res.status(400).json({ error: 'Topic is required' });
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
      },
      body: JSON.stringify({
        model: "deepseek-chat",
        messages: [{ role: "user", content: `Generate a catchy blog title and a short article about ${topic}.` }],
      }),
    });

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || "No response";

    const [titleLine, ...rest] = content.split('\n');
    const title = titleLine.replace(/^Title:/i, '').trim();
    const article = rest.join('\n').trim();

    res.status(200).json({ title, content: article });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}