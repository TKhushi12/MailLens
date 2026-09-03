import Email from '../models/Email.js';
import { processEmailWithAI } from './aiService.js';

export const sampleAgencyEmails = [
  {
    from: { name: 'Sarah Jenkins', email: 's.jenkins@lumina-skincare.com' },
    subject: 'URGENT: Meta Ad Account Suspended - Black Friday Campaign Halted',
    body: 'Hi Team, Our Meta ad account just got disabled due to an automated policy flag right before our Black Friday teaser launch. Our current spend is completely stopped. Please resolve this immediately with Meta support or switch to our backup business manager. We are losing $500/hour in sales right now.',
    receivedAt: new Date(Date.now() - 1000 * 60 * 25), // 25 mins ago
    isRead: false,
  },
  {
    from: { name: 'Marcus Vance', email: 'marcus@nexustech.io' },
    subject: 'Inquiry: Full-Service B2B Performance Marketing & Lead Gen Retainer',
    body: 'Hello MailLens Agency, We recently closed our Series A ($4.5M) and are actively looking for an agency partner to manage our Google Search, LinkedIn Ads, and SEO funnel. Our starting monthly ad budget is around $25,000 with a $6,000/month agency management fee. Could you please send us your agency capabilities deck and introductory pricing quotation by this Friday?',
    receivedAt: new Date(Date.now() - 1000 * 60 * 75), // 1.25 hours ago
    isRead: false,
  },
  {
    from: { name: 'Elena Rostova', email: 'elena@aurora-fashion.co' },
    subject: 'Feedback & Request: Revised Instagram Carousel Creatives',
    body: 'Hi Team, Thank you for sharing the draft ad concepts yesterday. The copy looks great, but our brand director wants us to change the background palette on slide 3 and 4 to our winter collection pastels. Please send us the revised campaign creatives by tomorrow 5 PM so we can sign off before Monday deployment.',
    receivedAt: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    isRead: false,
  },
  {
    from: { name: 'Google Ads Billing', email: 'payments-noreply@google.com' },
    subject: 'Google Ads: Payment of $4,850.00 successfully processed',
    body: 'Your automatic payment of $4,850.00 for Google Ads account #482-910-2391 has been successfully charged to Visa ending in 4102. Your receipt and tax invoice are available for download in your billing dashboard.',
    receivedAt: new Date(Date.now() - 1000 * 60 * 360), // 6 hours ago
    isRead: true,
  },
  {
    from: { name: 'Chloe Chen (Influencer)', email: 'chloe@chloestylemedia.com' },
    subject: 'Collaboration Pitch: Q4 Holiday Gift Guide & TikTok Integration',
    body: 'Hey team! I have 420K followers on TikTok and 180K on Instagram focused on clean lifestyle & tech gadgets. I would love to partner with one of your beverage or lifestyle clients for a dedicated video integration. I have attached my updated media kit and Q4 rate card. Let me know if you have a relevant brand campaign running!',
    receivedAt: new Date(Date.now() - 1000 * 60 * 540), // 9 hours ago
    isRead: false,
  },
  {
    from: { name: 'David Miller (Internal)', email: 'david.m@agencyinternal.com' },
    subject: 'Internal: Bi-weekly Marketing Strategy All-Hands Agenda',
    body: 'Team, please find the agenda for our bi-weekly all-hands meeting this Thursday at 11 AM EST. We will review Q3 client churn, celebrate the Lumina account win, and demonstrate our new MailLens workflow. Please submit any discussion items before Wednesday noon.',
    receivedAt: new Date(Date.now() - 1000 * 60 * 720), // 12 hours ago
    isRead: true,
  },
  {
    from: { name: 'Aiden Brooks', email: 'aiden@stridefootwear.com' },
    subject: 'Action Required: Monthly ROAS & Attribution Report for November',
    body: 'Hi account team, We need the comprehensive ROAS and blended CAC attribution breakdown for the November influencer blitz. Please send the final proposal and report by Friday afternoon so we can present it at our board meeting.',
    receivedAt: new Date(Date.now() - 1000 * 60 * 900), // 15 hours ago
    isRead: false,
  },
  {
    from: { name: 'Semrush Product Team', email: 'newsletter@semrush.com' },
    subject: 'Product Update: New AI Keyword Cluster Feature is Live',
    body: 'Discover how top agencies are grouping high-intent keywords 3x faster with our new clustering algorithm. Join our live product masterclass this Tuesday at 2 PM.',
    receivedAt: new Date(Date.now() - 1000 * 60 * 1200), // 20 hours ago
    isRead: true,
  },
  {
    from: { name: 'Priya Sharma', email: 'priya@zenithapparel.in' },
    subject: 'New Project Proposal: Rebranding & Paid Social Strategy for 2027',
    body: 'Dear MailLens team, We are launching an eco-friendly athleisure line next quarter and want an experienced agency to handle brand positioning, creative production, and paid social. We have allocated an initial marketing budget of ₹15,00,000 for the launch. Can we schedule a discovery call this week?',
    receivedAt: new Date(Date.now() - 1000 * 60 * 1400),
    isRead: false,
  },
  {
    from: { name: 'Kavita Patel', email: 'kavita@pulsefitness.com' },
    subject: 'Thanks for sharing the weekly campaign report',
    body: 'Thanks for sending over the numbers, team! The cost-per-acquisition looks solid this week. No immediate changes needed on our end. Keep up the good work!',
    receivedAt: new Date(Date.now() - 1000 * 60 * 1600),
    isRead: true,
  },
];

/**
 * Seed database with realistic marketing agency emails and process with AI.
 */
export const seedSampleEmails = async (forceClear = false) => {
  if (forceClear) {
    await Email.deleteMany({});
  }

  const count = await Email.countDocuments();
  if (count > 0 && !forceClear) {
    console.log(`[Seed Service] Database already contains ${count} emails. Skipping seed.`);
    return;
  }

  console.log('[Seed Service] Seeding realistic marketing agency emails into MongoDB...');
  for (const rawEmail of sampleAgencyEmails) {
    // Process with AI
    const aiAnalysis = await processEmailWithAI(rawEmail);

    const emailDoc = new Email({
      gmailId: `sim_${Date.now()}_${Math.random().toString(36).substring(7)}`,
      threadId: `th_${Math.random().toString(36).substring(7)}`,
      from: rawEmail.from,
      to: [{ name: 'Agency Inbound', email: 'inbox@agency.com' }],
      subject: rawEmail.subject,
      body: rawEmail.body,
      snippet: rawEmail.body.substring(0, 120) + '...',
      receivedAt: rawEmail.receivedAt,
      isRead: rawEmail.isRead,
      aiProcessed: true,
      ...aiAnalysis,
    });

    await emailDoc.save();
  }

  console.log(`[Seed Service] Successfully seeded and processed ${sampleAgencyEmails.length} agency emails.`);
};

/**
 * Simulate a single new incoming email dynamically for live demo
 */
export const simulateSingleIncomingEmail = async (templateIndex = null) => {
  const templates = [
    {
      from: { name: 'Jonathan Reed', email: 'jreed@velocitybrands.com' },
      subject: 'URGENT: Budget Cap Reached on Google Shopping - Ads Paused',
      body: 'Hi, our Google Shopping campaign just hit its monthly spend limit early and the ads stopped serving completely. Can you immediately increase the account cap by $10,000 and confirm as soon as possible?',
      receivedAt: new Date(),
      isRead: false,
    },
    {
      from: { name: 'Natasha Roman', email: 'natasha@glamcosmetics.co' },
      subject: 'Inquiry: Looking for TikTok & Meta Growth Agency ($15k/mo budget)',
      body: 'Hello! We are scaling our D2C cosmetics brand and need an agency to manage creative strategy and ad spend. Our budget is $15,000 per month. Please send us your pricing packages and case studies by tomorrow.',
      receivedAt: new Date(),
      isRead: false,
    },
    {
      from: { name: 'Accounting Dept', email: 'billing@agencyinternal.com' },
      subject: 'Invoice #4928 Due: Influencer Campaign Q3 Payments',
      body: 'Reminder that invoice #4928 for $12,400 covering influencer deliverables for the summer campaign is due by next Monday. Please review and approve for disbursement.',
      receivedAt: new Date(),
      isRead: false,
    },
  ];

  const selected = templateIndex !== null && templates[templateIndex] 
    ? templates[templateIndex] 
    : templates[Math.floor(Math.random() * templates.length)];

  selected.receivedAt = new Date();
  const aiAnalysis = await processEmailWithAI(selected);

  const newDoc = new Email({
    gmailId: `sim_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    threadId: `th_${Math.random().toString(36).substring(7)}`,
    from: selected.from,
    to: [{ name: 'Agency Inbound', email: 'inbox@agency.com' }],
    subject: selected.subject,
    body: selected.body,
    snippet: selected.body.substring(0, 120) + '...',
    receivedAt: selected.receivedAt,
    isRead: false,
    aiProcessed: true,
    ...aiAnalysis,
  });

  await newDoc.save();
  return newDoc;
};
