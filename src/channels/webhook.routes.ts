import { Router } from "express";
export const webhookRouter = Router();

// مسار التحقق (GET)
webhookRouter.get("/whatsapp", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === "my_secure_facebook_webhook_token") {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// مسار استقبال الرسائل (POST) - استقبال مفتوح بدون أي شروط
webhookRouter.post("/whatsapp", (req, res) => {
  console.log("✅ [DEBUG] وصلت رسالة من فيسبوك إلى السيرفر!");
  console.log("البيانات:", JSON.stringify(req.body, null, 2));

  // نرد فوراً بـ 200 لتخبر فيسبوك أننا استلمنا الرسالة
  res.status(200).send("EVENT_RECEIVED");
});
