export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).send('Use POST');

    const { defense, defendant, crime, history } = req.body;
    const API_KEY = process.env.GEMINI_KEY; 

    const prompt = `Você é um Juiz de tribunal implacável. 
    RÉU: ${defendant}. 
    CRIME: ${crime}. 
    HISTÓRICO: ${history}. 
    Analise a defesa: "${defense}". 
    Responda APENAS JSON puro: {"mudanca": 10, "reacao": "texto", "pergunta": "texto"}`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        return res.status(200).json(data);
    } catch (error) {
        return res.status(500).json({ error: "Erro no servidor" });
    }
}
