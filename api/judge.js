export default async function handler(req, res) {
    const { defense, defendant, crime, history } = req.body;
    const API_KEY = process.env.GEMINI_KEY;

    const prompt = `Você é um Juiz de tribunal. 
    RÉU: ${defendant}. CRIME: ${crime}. 
    Analise a defesa: "${defense}". 
    Responda APENAS JSON puro: {"mudanca": 10, "reacao": "texto", "pergunta": "texto"}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                contents: [{ parts: [{ text: prompt }] }],
                // Isso aqui evita o erro de "undefined"
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                ]
            })
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Erro interno" });
    }
}
