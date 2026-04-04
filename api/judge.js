// Onde antes chamava o Google, agora chama sua API da Vercel
const response = await fetch('/api/judge', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
        defense: defense,
        defendant: currentDefendant,
        crime: currentCrime,
        history: chatContext.slice(-4).join(" | ")
    })
});

const data = await response.json();

// O JSON do Gemini vem dentro de data.candidates[0].content.parts[0].text
let aiRawResponse = data.candidates[0].content.parts[0].text;
const res = JSON.parse(aiRawResponse.match(/\{[\s\S]*\}/)[0]);

// O resto da sua lógica de confiança e perguntas continua igual!
