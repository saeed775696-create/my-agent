import express from 'express';
import { config } from './core/config';
import { logger } from './core/logger';
import { errorHandler } from './core/errorHandler';
import { webhookRouter } from './channels/webhook.routes';

import { startFollowUpJobs } from './jobs/followUp';

const app = express();

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/webhooks', webhookRouter);

app.use(errorHandler);

startFollowUpJobs();

app.listen(config.PORT, () => {
  logger.info(`Server is running on port ${config.PORT}`);
});
