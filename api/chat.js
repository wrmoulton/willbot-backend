const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { message } = req.body;

  const SYSTEM_PROMPT = `
  You are WillBot, a friendly, witty chatbot assistant built by William Moulton.
  Your job is to answer questions about William's software engineering projects and experience.
  William’s GitHub: https://github.com/wrmoulton.
  Keep responses short, helpful, and fun.
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 300,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: message },
      ],
    });

    res.status(200).json({
      reply: response.choices[0].message.content.trim(),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ reply: "Oops! Something went wrong." });
  }
};
