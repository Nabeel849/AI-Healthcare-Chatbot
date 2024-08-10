import { NextResponse } from 'next/server';

const systemPrompt = `You are an AI-powered customer support assistant for PharmaAI, a platform that provides AI-powered disease information, symptoms, and treatments to patients. Your goal is to provide accurate information, assist with common inquiries, and ensure a positive experience for all PharmaAI users. Limit each response to one line. Remember what was said before to maintain the context of the conversation. End the conversation by informing the user that their responses have been recorded and forwarded to a doctor.`;

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

    try {
        const userQuery = data.query;
        if (!userQuery) {
            throw new Error("No query provided");
        }

        const conversationHistory = data.history || []; 
        conversationHistory.push(`User: ${userQuery}`);
        const prompt = `${systemPrompt}\n\n${conversationHistory.join('\n')}`;

        let aiResponse = await queryGemini(prompt);

        aiResponse = aiResponse.split('\n')[0].trim();
        conversationHistory.push(`AI: ${aiResponse}`);
        // Limiting the coversation 
        const shouldEndConversation = conversationHistory.length >= 6;
        if (shouldEndConversation) {
            aiResponse += `\nGoodbye! The conversation has been recorded and forwarded to a doctor. You can email the doctor about your response at doc@gmail.com.`;
        }

        return new Response(JSON.stringify({ response: aiResponse, history: conversationHistory }), {
            headers: { 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error occurred:', error.message);
        return new Response(JSON.stringify({ response: 'Sorry, something went wrong. Please try again later.' }), {
            headers: { 'Content-Type': 'application/json' },
            status: 500,
        });
    }
}
