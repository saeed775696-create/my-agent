import cron from "node-cron";
import { prisma } from "../core/db.js";
import { logger } from "../core/logger.js";

export function startFollowUpJobs() {
  // مثال: كل 15 دقيقة، أغلق المحادثات غير النشطة منذ 30 دقيقة
  cron.schedule("*/15 * * * *", async () => {
    try {
      const staleConversations = await prisma.conversation.findMany({
        where: {
          status: "active",
          lastMessageAt: {
            lt: new Date(Date.now() - 30 * 60 * 1000), // 30 min
          },
        },
      });
      for (const conv of staleConversations) {
        await prisma.conversation.update({
          where: { id: conv.id },
          data: { status: "closed" },
        });
        logger.info(`Closed inactive conversation: ${conv.id}`);
      }
    } catch (error) {
      logger.error(error, "Follow-up job error");
    }
  });
  logger.info("Follow-up jobs started");
}
