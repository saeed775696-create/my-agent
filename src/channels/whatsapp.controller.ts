import type { Request, Response } from "express";
import { handleIncoming } from "../core/dispatcher.js";
import { logger } from "../core/logger.js";
import { config } from "../core/config.js";

export function verifyWhatsAppWebhook(req: Request, res: Response) {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];
  logger.info(`Webhook verification attempt: mode=${mode}, token=${token}`);
  if (mode === "subscribe" && token === config.FACEBOOK_VERIFY_TOKEN) {
    logger.info("WhatsApp webhook verified");
    res.status(200).send(challenge);
  } else {
    logger.warn("WhatsApp webhook verification failed");
    res.sendStatus(403);
  }
}

export async function handleWhatsAppWebhook(req: Request, res: Response) {
  logger.info("WEBHOOK POST RECEIVED"); // سجل البداية
  try {
    const body = req.body;
    logger.info("Body: " + JSON.stringify(body).substring(0, 200)); // سجل مختصر
    if (body.object === "whatsapp_business_account") {
      for (const entry of body.entry) {
        const changes = entry.changes || [];
        for (const change of changes) {
          if (change.value?.messages) {
            const message = change.value.messages[0];
            const senderId = message.from;
            const text = message.text?.body;
            logger.info(`Message detected: from=${senderId}, text=${text}`);
            if (senderId && text) {
              await handleIncoming({
                channel: "whatsapp",
                senderId,
                text,
                timestamp: new Date(),
              });
            } else {
              logger.warn("Message missing senderId or text");
            }
          } else {
            logger.warn("Change value missing messages");
          }
        }
      }
    } else {
      logger.warn("Invalid object type: " + body.object);
    }
    res.sendStatus(200);
    logger.info("Webhook processing finished successfully");
  } catch (error) {
    logger.error(error, "Error handling WhatsApp webhook");
    res.sendStatus(500);
  }
}
