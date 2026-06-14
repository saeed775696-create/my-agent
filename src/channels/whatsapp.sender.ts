import axios from "axios";
import { config } from "../core/config.js";
import { logger } from "../core/logger.js";

export async function sendWhatsAppMessage(
  to: string,
  reply: { type: string; content: any },
) {
  // استخدم إصدار API مستقر (مثل v20.0)
  const url = https://graph.facebook.com/v20.0/${config.WHATSAPP_PHONE_NUMBER_ID}/messages;
  
  const headers = {
    "Authorization": Bearer ${config.WHATSAPP_ACCESS_TOKEN},
    "Content-Type": "application/json",
  };

  let payload: any;

  if (reply.type === "text") {
    // التأكد من أن المحتوى نصي بحت
    const bodyText = typeof reply.content === 'object' 
      ? (reply.content.text || JSON.stringify(reply.content)) 
      : reply.content;
      
    payload = {
      messaging_product: "whatsapp",
      to,
      text: { body: bodyText },
    };
  } else if (reply.type === "quick_reply") {
    payload = {
      messaging_product: "whatsapp",
      to,
      interactive: reply.content,
    };
  } else {
    logger.warn(Unknown reply type for WhatsApp: ${reply.type});
    return;
  }

  try {
    logger.info(Sending message to ${to}...);
    const response = await axios.post(url, payload, { headers });
    logger.info("WhatsApp message sent successfully:", response.data.message_id);
  } catch (error: any) {
    // هذا الجزء هو المفتاح لحل مشكلتك (سيظهر الخطأ في Logs موقع Render)
    if (error.response) {
      logger.error("خطأ من Meta (API Response):", JSON.stringify(error.response.data, null, 2));
    } else {
      logger.error("خطأ في الاتصال بالسيرفر:", error.message);
    }
  }
}
