import axios from "axios";
import { config } from "../core/config.js";
import { logger } from "../core/logger.js";

export async function sendWhatsAppMessage(
  to: string,
  reply: { type: string; content: any },
) {
<<<<<<< HEAD
  const url =
    "https://graph.facebook.com/v20.0/" +
    config.WHATSAPP_PHONE_NUMBER_ID +
    "/messages";
  const headers = {
    Authorization: "Bearer " + config.WHATSAPP_ACCESS_TOKEN,
=======
  const url = `https://graph.facebook.com/v21.0/${config.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const headers = {
    Authorization: `Bearer ${config.WHATSAPP_ACCESS_TOKEN}`,
>>>>>>> 4cc21b3c04569a547fccf2baf0bea712e1ff224f
    "Content-Type": "application/json",
  };

  let payload: any;

  if (reply.type === "text") {
<<<<<<< HEAD
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
=======
    payload = {
      messaging_product: "whatsapp",
      to,
      text: { body: reply.content },
>>>>>>> 4cc21b3c04569a547fccf2baf0bea712e1ff224f
    };
  } else if (reply.type === "quick_reply") {
    payload = {
      messaging_product: "whatsapp",
<<<<<<< HEAD
      recipient_type: "individual",
      to: to,
      type: "interactive",
      interactive: reply.content,
    };
  } else {
    logger.warn("Unknown reply type for WhatsApp: " + reply.type);
=======
      to,
      interactive: reply.content,
    };
  } else {
    logger.warn(`Unknown reply type for WhatsApp: ${reply.type}`);
>>>>>>> 4cc21b3c04569a547fccf2baf0bea712e1ff224f
    return;
  }

  try {
<<<<<<< HEAD
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
=======
    await axios.post(url, payload, { headers });
  } catch (error) {
    logger.error(error, "Failed to send WhatsApp message");
>>>>>>> 4cc21b3c04569a547fccf2baf0bea712e1ff224f
  }
}
