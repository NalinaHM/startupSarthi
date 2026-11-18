export default async function handler(req, res) {
  // Allow CORS for both the deployed Vercel PWA and Capacitor Android mobile builds
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  const apiKey = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "").trim();
  if (!apiKey) {
    return res.status(500).json({
      error:
        "Server GEMINI_API_KEY is not configured. Add GEMINI_API_KEY in Vercel Project Settings → Environment Variables and redeploy.",
    });
  }

  try {
    const { systemPrompt, userPrompt, model } = req.body || {};
    if (!userPrompt || typeof userPrompt !== "string") {
      return res.status(400).json({ error: "Missing userPrompt in request body." });
    }

    const safeModel =
      typeof model === "string" && /^[a-zA-Z0-9._-]+$/.test(model)
        ? model
        : process.env.VITE_GEMINI_MODEL || "gemini-2.5-flash";

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${safeModel}:generateContent`;

    const response = await fetch(geminiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        systemInstruction: systemPrompt ? { parts: [{ text: systemPrompt }] } : undefined,
        contents: [{ role: "user", parts: [{ text: userPrompt }] }],
        generationConfig: {
          maxOutputTokens: 8192,
          responseMimeType: "application/json",
          temperature: 0.65,
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error?.message || `Gemini API error (${response.status})`,
      });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
    if (!text) {
      return res.status(502).json({ error: "Gemini returned an empty analysis." });
    }

    return res.status(200).json({ text });
  } catch (err) {
    return res.status(500).json({
      error: err instanceof Error ? err.message : "Unexpected server error.",
    });
  }
}
