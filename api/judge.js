export default async function handler(req, res) {
    // Garante que só aceitamos requisições do tipo POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método não permitido' });
    }

    const { defense, defendant, crime, history } = req.body;
    const API_KEY = process.env.GEMINI_KEY; 

    // O "Manual" de como o Juiz deve se comportar
    const prompt = `Você é um Juiz de tribunal implacável e sarcástico. 
    RÉU: ${defendant}. 
    CRIME: ${crime}. 
    HISTÓRICO DO CHAT: ${history}. 
    DEFESA APRESENTADA: "${defense}". 
    
    Sua tarefa: Analise a defesa e responda se o réu parece mais culpado ou inocente.
    REGRAS DE RESPOSTA: Responda APENAS um objeto JSON puro, sem textos antes ou depois, com este formato:
    {"mudanca": valor_de_-20_a_20, "reacao": "sua reação curta", "pergunta": "sua próxima pergunta"}`;

    try {
        // Usando a URL v1 (estável) para evitar o erro 404 de modelo não encontrado
        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                contents: [{ parts: [{ text: prompt }] }],
                safetySettings: [
                    { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_HATE_SPEECH", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_NONE" },
                    { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_NONE" }
                ]
            })
        });

        const data = await response.json();

        // Se o Google retornar um erro, repassamos para o console do navegador entender
        if (data.error) {
            console.error("Erro do Google:", data.error);
            return res.status(500).json(data);
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error("Erro interno:", error);
        return res.status(500).json({ error: "Erro ao processar o julgamento" });
    }
}
