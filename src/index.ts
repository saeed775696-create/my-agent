import express from 'express';
<<<<<<< HEAD
import { config } from './core/config.js';
import { logger } from './core/logger.js';
import { errorHandler } from './core/errorHandler.js';
import { webhookRouter } from './channels/webhook.routes.js';
import { startFollowUpJobs } from './jobs/followUp.js';
=======
import { config } from './core/config';
import { logger } from './core/logger';
import { errorHandler } from './core/errorHandler';
import { webhookRouter } from './channels/webhook.routes';

import { startFollowUpJobs } from './jobs/followUp';
>>>>>>> 4cc21b3c04569a547fccf2baf0bea712e1ff224f

const app = express();

app.use(express.json());

<<<<<<< HEAD
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

=======
>>>>>>> 4cc21b3c04569a547fccf2baf0bea712e1ff224f
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/webhooks', webhookRouter);

app.use(errorHandler);

startFollowUpJobs();

app.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`);
<<<<<<< HEAD
});
=======
});
>>>>>>> 4cc21b3c04569a547fccf2baf0bea712e1ff224f
