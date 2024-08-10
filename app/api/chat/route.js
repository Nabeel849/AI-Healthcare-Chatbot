import { NextResponse } from 'next/server';

const systemPrompt = `You are an AI-powered customer support assistant for PharmaAI, a platform that provides AI-powered disease information, symptoms, and treatments to patients. Your goal is to provide accurate information, assist with common inquiries, and ensure a positive experience for all PharmaAI users. Limit each response to one line. Remember what was said before to maintain the context of the conversation. End the conversation by informing the user that their responses have been recorded and forwarded to a doctor.`;

async function queryGemini(text) {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: text }],
            },
          ],
        }),
      }
    );
  
    if (!response.ok) {
      throw new Error("Failed to fetch data from Gemini API");
    }
  
    const result = await response.json();
  
    // Log the entire response to ensure we're handling the correct structure
    console.log("Full response from Gemini API:", JSON.stringify(result, null, 2));
  
    // Extract the text from the response structure
    if (
      result &&
      result.candidates &&
      result.candidates[0] &&
      result.candidates[0].content &&
      result.candidates[0].content.parts &&
      result.candidates[0].content.parts[0] &&
      result.candidates[0].content.parts[0].text
    ) {
      return result.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Unexpected response structure from Gemini API");
    }
  }
  
  export async function POST(req) {
    try {
      const data = await req.json();
      const userQuery = data.query;
  
      if (!userQuery) {
        throw new Error("No query provided");
      }
  
      const conversationHistory = data.history || [];
      conversationHistory.push(`User: ${userQuery}`);
  
      const prompt = `${systemPrompt}\n\n${conversationHistory.join("\n")}`;
      let aiResponse = await queryGemini(prompt);
  
      aiResponse = aiResponse.split("\n")[0].trim();
      conversationHistory.push(`AI: ${aiResponse}`);
  
      // Optional: Limit the conversation length and end it after a certain number of exchanges
      const shouldEndConversation = conversationHistory.length >= 6;
      if (shouldEndConversation) {
        aiResponse += `\nGoodbye! The conversation has been recorded.`;
      }
  
      return NextResponse.json({
        response: aiResponse,
        history: conversationHistory,
      });
    } catch (error) {
      console.error("Error occurred:", error.message);
      return new NextResponse("Internal Server Error", { status: 500 });
    }
  }