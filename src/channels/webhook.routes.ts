import { Router } from "express";
import {
  handleWhatsAppWebhook,
  verifyWhatsAppWebhook,
} from "./whatsapp.controller.js";
import {
  handleFacebookWebhook,
  verifyFacebookWebhook,
} from "./facebook.controller.js";

const router = Router();

// WhatsApp
router.get("/whatsapp", verifyWhatsAppWebhook);
router.post("/whatsapp", handleWhatsAppWebhook);

// Facebook Messenger
router.get("/facebook", verifyFacebookWebhook);
router.post("/facebook", handleFacebookWebhook);

export { router as webhookRouter };
