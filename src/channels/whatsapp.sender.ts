import axios from "axios";
import { config } from "../core/config.js";
import { logger } from "../core/logger.js";

export async function sendWhatsAppMessage(
  to: string,
  reply: { type: string; content: any },
) {
  const url =
    "https://graph.facebook.com/v20.0/" +
    config.WHATSAPP_PHONE_NUMBER_ID +
    "/messages";
  const headers = {
    Authorization: "Bearer " + config.WHATSAPP_ACCESS_TOKEN,
    "Content-Type": "application/json",
  };

  let payload: any;

  if (reply.type === "text") {
    // التحقق مما إذا كان المحتوى نصاً مباشراً أو كائناً يحتوي على حقل النص
    const textBody =
      typeof reply.content === "object" && reply.content?.text
        ? reply.content.text
        : typeof reply.content === "string"
          ? reply.content
          : JSON.stringify(reply.content);

    payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "text",
      text: { body: textBody },
    };
  } else if (reply.type === "quick_reply") {
    payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: to,
      type: "interactive",
      interactive: reply.content,
    };
  } else {
    logger.warn("Unknown reply type for WhatsApp: " + reply.type);
    return;
  }

  try {
    const response = await axios.post(url, payload, { headers });
    if (response.data && response.data.messages) {
      logger.info(
        "[WhatsApp] Message sent successfully. ID: " +
          response.data.messages[0].id,
      );
    }
  } catch (error: any) {
    logger.error(
      error.response?.data || error.message,
      "[WhatsApp] Error sending message via Meta API",
    );
  }
}
