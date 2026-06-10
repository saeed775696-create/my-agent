import express from 'express';
import { config } from './core/config.js';
import { logger } from './core/logger.js';
import { errorHandler } from './core/errorHandler.js';
import { webhookRouter } from './channels/webhook.routes.js';
import { startFollowUpJobs } from './jobs/followUp.js';

const app = express();

app.use(express.json());

// 🔥 هذا الفحص الشامل لمراقبة أي رسالة قادمة من فيسبوك فوراً
app.use('/webhooks', (req, res, next) => {
  console.log("==========================================");
  console.log("🔥 RAW WEBHOOK DETECTED!");
  console.log("Method:", req.method);
  console.log("Query Params:", req.query);
  console.log("Body Payload:", JSON.stringify(req.body, null, 2));
  console.log("==========================================");
  next(); 
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/webhooks', webhookRouter);

app.use(errorHandler);

startFollowUpJobs();

app.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`);
});