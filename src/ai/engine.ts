import OpenAI from "openai";
import { logger } from "../core/logger.js";
import { config } from '../core/config.js';

const client = new OpenAI({
  baseURL: "https://api.groq.com/openai/v1",
 apiKey: config.GROQ_API_KEY,
});

interface ConversationState {
  collectedData: Record<string, any>;
  history: { role: "user" | "assistant"; content: string }[];
}

interface ProcessMessageParams {
  id: string;
  collectedData: Record<string, any>;
  history: { role: "user" | "assistant"; content: string }[];
}

interface EngineResponse {
  replies: {
    type: string;
    content: any;
  }[];
  updatedState: Record<string, any>;
  endConversation: boolean;
}

export async function processMessage(
  state: ProcessMessageParams,
  userMessage: { text?: string },
): Promise<EngineResponse> {
  const messages: any[] = [
    {
      role: "system",
      content: `You are a helpful customer service agent. You can speak Arabic and English.
The current dialog state (collected data) is: ${JSON.stringify(state.collectedData)}.
Use it to understand the user's intent and fill missing slots.
If you need to ask a question to fill a slot, do so.
When all required slots are filled, respond with a final answer and set "endConversation": true.
Always respond in JSON format:
{
  "replies": [{ "type": "text", "content": "your reply text" }],
  "updatedState": { "intent": "...", "slots": {...} },
  "endConversation": false
}`,
    },
    ...state.history.map((h) => ({
      role: h.role,
      content: h.content,
    })),
  ];

  if (userMessage.text) {
    messages.push({ role: "user", content: userMessage.text });
  }

  try {
    const completion = await client.chat.completions.create({
      model: "llama-3.1-8b-instant", // نموذج مجاني وسريع من Groq
      messages,
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);

    return {
      replies: parsed.replies || [{ type: "text", content: raw }],
      updatedState: parsed.updatedState || state.collectedData,
      endConversation: parsed.endConversation || false,
    };
  } catch (error) {
    logger.error(error, "AI engine error");
    return {
      replies: [
        { type: "text", content: "عذراً، حدث خطأ. يرجى المحاولة لاحقاً." },
      ],
      updatedState: state.collectedData,
      endConversation: false,
    };
  }
}
