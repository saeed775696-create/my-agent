import axios from "axios";
import { config } from "../core/config.js";
import { logger } from "../core/logger.js";

export async function sendWhatsAppMessage(
  to: string,
  reply: { type: string; content: any },
) {
  const url = `https://graph.facebook.com/v21.0/${config.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const headers = {
    Authorization: `Bearer ${config.WHATSAPP_ACCESS_TOKEN}`,
    "Content-Type": "application/json",
  };

  let payload: any;

  if (reply.type === "text") {
    payload = {
      messaging_product: "whatsapp",
      to,
      text: { body: reply.content },
    };
  } else if (reply.type === "quick_reply") {
    payload = {
      messaging_product: "whatsapp",
      to,
      interactive: reply.content,
    };
  } else {
    logger.warn(`Unknown reply type for WhatsApp: ${reply.type}`);
    return;
  }

  try {
    await axios.post(url, payload, { headers });
  } catch (error) {
    logger.error(error, "Failed to send WhatsApp message");
  }
}
