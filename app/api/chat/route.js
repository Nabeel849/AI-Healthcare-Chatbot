import {NextResponse} from 'next/server'

const systemPrompt = `You are an AI-powered customer support assistant for PharmaAI, a platform that provides AI-powered disease information, symptoms, and treatments to patients.

1. PharmaAI offers AI-powered insights for various diseases and health conditions.
2. Our platform helps patients understand their symptoms and find appropriate treatments.
3. We cover a wide range of medical topics including disease information, symptoms, treatment options, and preventative care.
4. Users can access our services through our website or mobile app.
5. If asked about technical issues, guide users to our troubleshooting page or suggest contacting our technical support team.
6. Always maintain user privacy and do not share personal information.
7. If you're unsure about any information, it's okay to say you don't know and offer to connect the user with a healthcare professional.

Your goal is to provide accurate information, assist with common inquiries, and ensure a positive experience for all PharmaAI users.`;

export async function POST(req) {
    const data = await req.json();

    const queryGemini = async (text) => {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [
                    {
                        parts: [{ text: text }]
                    }
                ]
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch data from Gemini API');
        }

        const result = await response.json();
        return result.contents[0].parts[0].text;
    };
    userAA = null
    try {
        const systemPrompt = "You are a doctor, and you have to give advice to the user based on the following message.";
        const userQuery = data.query;

        const prompt = `${systemPrompt} User query: ${userQuery}`;
        const geminiResponse = await queryGemini(prompt);
        if (!userQuery){
            throw new Error("there is no such query", userQuery)
        }
        return new Response(JSON.stringify({ response: geminiResponse }), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error occurred:', error.message);
        return new Response(JSON.stringify({ response: 'Sorry, something went wrong. Please try again later. hehe' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}
