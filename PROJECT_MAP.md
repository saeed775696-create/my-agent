# الخريطة الهندسية للمشروع (Project Map)
التاريخ: 2026-06

## [TECH_STACK]
- **Runtime Environment:** Node.js v22.x LTS
- **Language:** TypeScript v6.0.3
- **Framework:** Express.js v5.2.1 (Fast, minimal, stable routing)
- **Database:** PostgreSQL v16
- **ORM:** Prisma v6.x (Type-safe database access)
- **AI Integration:** OpenAI SDK v4.x
- **Logging:** Pino (Asynchronous, non-blocking JSON logger)
- **Task Scheduling:** Node-cron (for follow-up automation)
- **Integrations:** Meta Graph API (WhatsApp Business, FB Messenger, IG), Google Sheets API.

## [SYSTEM_FLOW] (Data Flow & Verifiable Goals)
1. **[Goal: Ingestion]** Webhook Endpoint يستقبل الرسائل من (WA, FB, IG). يتم توحيد هيكل الرسالة (Message Normalization).
2. **[Goal: Extraction & Persistence]** استخراج بيانات العميل (الاسم، الهاتف، المدينة، المصدر) عبر AI وتخزينها في جدول `customers`.
3. **[Goal: Classification]** تحديد حالة العميل (محتمل، مهتم، جاهز، حالي، متابعة، غاضب).
4. **[Goal: Decision Engine]** معالجة الطلب عبر OpenAI (Prompting). إذا كان غاضباً أو يتطلب موظفاً بشرياً -> تفعيل نظام التصعيد (Escalation).
5. **[Goal: Dispatch & Sync]** إرسال الرد للعميل، تسجيل المحادثة في `conversations`، تحديث `leads` أو `orders`، والمزامنة مع Google Sheets و CRM.
6. **[Goal: Automated Follow-up]** Job يعمل دورياً لفحص العملاء غير المستجيبين وإرسال رسائل متابعة (1, 3, 7 أيام).

## [ARCHITECTURE] (Surgical & Domain-Driven)
تبني هيكلية مبسطة بدون ملفات دقيقة (No Micro-files) لتسهيل الصيانة:
- `/src/core`: الأساسيات المشتركة (Database Client, Logger, Config, Error Handler).
- `/src/channels`: التعامل مع الـ Webhooks وإرسال الرسائل (Meta APIs).
- `/src/ai`: منطق الذكاء الاصطناعي (OpenAI Integration, Prompt Management).
- `/src/domains/customer`: منطق إدارة العملاء، الطلبات، والـ Leads.
- `/src/jobs`: الأتمتة والمتابعة الزمنية (Cron Jobs).

## [ORPHANS & PENDING]
- لا يوجد (تم التنفيذ بالكامل).

