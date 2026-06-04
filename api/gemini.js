export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: "POST Method သာ ခွင့်ပြုပါသည်" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: "API Key မရှိသေးပါ။ Vercel တွင် ထည့်ပေးပါ။" });
    }

    // Frontend က လှမ်းပို့လိုက်တဲ့ Page ထဲက စာသားများ
    const { context } = req.body;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    // AI ကို ပေးမယ့် စနစ်တကျ ညွှန်ကြားချက် (Prompt)
    const promptData = {
        contents: [{
            parts: [{ 
                text: `မင်းက စမတ်ကျတဲ့ Web App Assistant တစ်ဦး ဖြစ်တယ်။ အောက်မှာ ပေးထားတဲ့ စာသားတွေက အသုံးပြုသူ လက်ရှိကြည့်နေတဲ့ Web Page ထဲက အချက်အလက်တွေ ဖြစ်တယ်။ ဒီအချက်အလက်တွေကို ကြည့်ပြီး အသုံးပြုသူအတွက် အသုံးဝင်မယ့် အကြံပြုချက်၊ သုံးသပ်ချက် သို့မဟုတ် Summary ကို မြန်မာလို လိုရင်းတိုရှင်း ထုတ်ပေးပါ။ ဘာမှ ပြန်မမေးပါနဲ့၊ အဖြေပဲ တိုက်ရိုက်ထုတ်ပေးပါ။
                
                --- လက်ရှိ Page ၏ အချက်အလက်များ ---
                ${context}` 
            }]
        }]
    };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(promptData)
        });

        const data = await response.json();
        const aiText = data.candidates[0].content.parts[0].text;

        return res.status(200).json({ reply: aiText });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
}
