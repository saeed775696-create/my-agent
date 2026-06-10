import type { Request, Response } from "express";
import { handleIncoming } from "../core/dispatcher.js";
import { logger } from "../core/logger.js";
import { config } from "../core/config.js";

// Facebook webhook verification (GET)
export function verifyFacebookWebhook(req: Request, res: Response) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === config.FACEBOOK_VERIFY_TOKEN) {
    logger.info("Facebook webhook verified");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
}

export async function handleFacebookWebhook(req: Request, res: Response) {
  try {
    const body = req.body;
    if (body.object === "page") {
      for (const entry of body.entry) {
        const messaging = entry.messaging || [];
        for (const event of messaging) {
          const senderId = event.sender?.id;
          const message = event.message;
          if (senderId && message?.text) {
            await handleIncoming({
              channel: "facebook",
              senderId,
              text: message.text,
              timestamp: new Date(),
            });
          }
        }
      }
    }
    res.sendStatus(200);
  } catch (error) {
    logger.error(error, "Error handling Facebook webhook");
    res.sendStatus(500);
  }
}
