import { prisma } from "./db.js";
import { processMessage } from "../ai/engine.js";
import { sendWhatsAppMessage } from "../channels/whatsapp.sender.js";
import { sendFacebookMessage } from "../channels/facebook.sender.js";
import { logger } from "./logger.js";

export interface IncomingMessage {
  channel: "whatsapp" | "facebook";
  senderId: string;
  text?: string;
  attachments?: any[];
  quickReplyPayload?: string;
  timestamp: Date;
}

export async function handleIncoming(msg: IncomingMessage) {
  logger.info(
    `Dispatcher: handling message from ${msg.senderId} on ${msg.channel}: ${msg.text}`,
  );

  // 1. Find or create conversation
  let conv = await prisma.conversation.findFirst({
    where: {
      channel: msg.channel,
      channelUserId: msg.senderId,
      status: "active",
    },
  });

  if (!conv) {
    conv = await prisma.conversation.create({
      data: {
        channel: msg.channel,
        channelUserId: msg.senderId,
        collectedData: "{}",
      },
    });
  }

  // 2. Save inbound message
  await prisma.message.create({
    data: {
      conversationId: conv.id,
      direction: "inbound",
      contentType: msg.attachments?.length ? "media" : "text",
      content: JSON.stringify(msg.text ? { text: msg.text } : msg.attachments),
    },
  });

  // 3. Load history
  const historyMessages = await prisma.message.findMany({
    where: { conversationId: conv.id },
    orderBy: { timestamp: "asc" },
    take: 20,
  });

  const history = historyMessages.map((m) => ({
    role:
      m.direction === "inbound" ? ("user" as const) : ("assistant" as const),
    content: JSON.parse(m.content)?.text || "",
  }));

  // 4. Call AI engine
  const engineResponse = await processMessage(
    {
      id: conv.id,
      collectedData: JSON.parse(conv.collectedData || "{}"),
      history,
    },
    msg,
  );

  logger.info(`AI replied with: ${JSON.stringify(engineResponse.replies)}`);

  // 5. Save and send outbound messages
  for (const reply of engineResponse.replies) {
    await prisma.message.create({
      data: {
        conversationId: conv.id,
        direction: "outbound",
        contentType: reply.type || "text",
        content: JSON.stringify(reply.content),
      },
    });

    if (msg.channel === "whatsapp") {
      logger.info(`Sending to WhatsApp: ${JSON.stringify(reply)}`);
      await sendWhatsAppMessage(msg.senderId, reply);
    } else if (msg.channel === "facebook") {
      await sendFacebookMessage(msg.senderId, reply);
    }
  }

  // 6. Update conversation state
  await prisma.conversation.update({
    where: { id: conv.id },
    data: {
      collectedData: JSON.stringify(engineResponse.updatedState),
      lastMessageAt: new Date(),
      status: engineResponse.endConversation ? "closed" : "active",
    },
  });
}
