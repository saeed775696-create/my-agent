import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
  PORT: z.coerce.number().default(3000),
  DATABASE_URL: z.string(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().min(1),
  WHATSAPP_ACCESS_TOKEN: z.string().min(1),
  FACEBOOK_PAGE_ACCESS_TOKEN: z.string().min(1),
  FACEBOOK_VERIFY_TOKEN: z.string().min(1),
  GROQ_API_KEY: z.string().min(1),   // ← هذا مهم جداً
  LOG_LEVEL: z.string().default('info'),
});

export const config = envSchema.parse(process.env);