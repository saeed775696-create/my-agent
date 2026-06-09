import axios from "axios";
import { config } from "../core/config.js";
import { logger } from "../core/logger.js";

export async function sendFacebookMessage(
  psid: string,
  reply: { type: string; content: any },
) {
  const url = `https://graph.facebook.com/v21.0/me/messages?access_token=${config.FACEBOOK_PAGE_ACCESS_TOKEN}`;
  const headers = { "Content-Type": "application/json" };

  let payload: any;

  if (reply.type === "text") {
    payload = {
      recipient: { id: psid },
      message: { text: reply.content },
    };
  } else if (reply.type === "quick_reply") {
    payload = {
      recipient: { id: psid },
      message: reply.content, // must contain text and quick_replies array
    };
  } else {
    logger.warn("Unknown reply type for Facebook:", reply.type);
    return;
  }

  try {
    await axios.post(url, payload, { headers });
  } catch (error) {
    logger.error(error, "Failed to send Facebook message");
  }
}
