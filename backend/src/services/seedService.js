import Email from '../models/Email.js';
import { processEmailWithAI } from './aiService.js';

export const sampleAgencyEmails = [
  {
    from: { name: 'Sneha Kulkarni', email: 'sneha@luminaskincare.in' },
    subject: 'URGENT: Meta Ad Account Suspended - Diwali Festive Campaign Halted',
    body: 'Hi Khushi Team, Our Meta ad account just got disabled due to an automated policy flag right before our festive Diwali mega sale launch. Our current spend is completely stopped. Please resolve this immediately with Meta support or switch to our backup business manager. We are losing ₹40,000/hour in sales right now.',
    receivedAt: new Date(Date.now() - 1000 * 60 * 25), // 25 mins ago
    isRead: false,
  },
  {
    from: { name: 'Meta Ads Policy Review', email: 'appeals-noreply@facebookmail.com' },
    subject: 'Urgent: Meta Ad Account #482-910-2391 Suspended — Policy 4.2 Violation',
    body: 'Your Meta ad account #482-910-2391 has been disabled due to an automated flag for Advertising Policy 4.2 (Unacceptable Business Practices). All 14 active campaigns have been halted and live ads have stopped serving across India. Estimated daily client spend of ₹45,000 is disrupted. If you believe this decision was made in error, please submit an official appeal with verified GSTIN and business registration details.',
    receivedAt: new Date(Date.now() - 1000 * 60 * 30), // 30 mins ago
    isRead: false,
  },
  {
    from: { name: 'Aarav Mehta', email: 'aarav@nexustech.in' },
    subject: 'Inquiry: Full-Service B2B Performance Marketing & Lead Gen Retainer',
    body: 'Hello MailLens Agency, We recently closed our Series A funding (₹35 Crore) and are actively looking for an agency partner to manage our Google Search, LinkedIn Ads, and SEO funnel across India and UAE. Our starting monthly ad budget is around ₹18,00,000 with a ₹4,50,000/month agency management retainer fee. Could you please send us your agency capabilities deck and introductory pricing quotation by this Friday?',
    receivedAt: new Date(Date.now() - 1000 * 60 * 75), // 1.25 hours ago
    isRead: false,
  },
  {
    from: { name: 'Ananya Verma', email: 'ananya@aurorafashion.in' },
    subject: 'Quick favor: Can you also quickly redesign our website banner for the weekend?',
    body: 'Hi Khushi Team, Thank you for sharing the festive ad concepts yesterday! Quick favor: can you also quickly redesign our main desktop and mobile website banners for our Diwali Festive Flash Sale this Saturday? We need the new banners live by Friday 5 PM before deployment. Thanks so much!',
    receivedAt: new Date(Date.now() - 1000 * 60 * 180), // 3 hours ago
    isRead: false,
  },
  {
    from: { name: 'Rohan Kapoor', email: 'rohan@stridefootwear.in' },
    subject: 'Q4 Campaign Brief: Winter Stride Athleisure Launch',
    body: 'Hey MailLens team, We are officially ready to launch our Winter Stride athleisure line across Delhi NCR, Mumbai, and Bengaluru. Target audience is active runners & fitness enthusiasts aged 22-38 in metropolitan cities. Total marketing budget is ₹15,00,000 across Instagram Reels and Google Search. We need 3 Instagram Reels, 4 Carousel Product showcases, and Google Search Ads copy with launch target by Nov 15th. Please prepare the creative campaign brief and team task breakdown so our directors can sign off.',
    receivedAt: new Date(Date.now() - 1000 * 60 * 240), // 4 hours ago
    isRead: false,
  },
  {
    from: { name: 'Google Ads Billing India', email: 'payments-noreply@google.com' },
    subject: 'Google Ads India: Payment of ₹38,450.00 successfully processed',
    body: 'Your automatic payment of ₹38,450.00 for Google Ads account #482-910-2391 has been successfully charged to HDFC Visa Corporate card ending in 4102. Your GST tax invoice is available for download in your billing dashboard.',
    receivedAt: new Date(Date.now() - 1000 * 60 * 360), // 6 hours ago
    isRead: true,
  },
  {
    from: { name: 'Riya Sen (Fashion & Lifestyle Creator)', email: 'riya@riyastylemedia.in' },
    subject: 'Collaboration Pitch: Festive Wedding & Lifestyle Campaign Integration',
    body: 'Hey team! I have 420K followers on Instagram and 210K subscribers on YouTube Shorts focused on Indian festive fashion & lifestyle. I would love to partner with one of your beauty or apparel clients (like Aurora or Lumina) for dedicated Reels integration. My standard rate card is ₹75,000 per Reel with guaranteed 80K+ views. Attached is my media kit. Let me know if you have an active campaign!',
    receivedAt: new Date(Date.now() - 1000 * 60 * 540), // 9 hours ago
    isRead: false,
  },
  {
    from: { name: 'Vikram Malhotra (Operations Lead)', email: 'vikram.m@agencyinternal.in' },
    subject: 'Internal: Bi-weekly Marketing Strategy All-Hands Agenda',
    body: 'Team, please find the agenda for our bi-weekly all-hands meeting this Thursday at 11:30 AM IST. We will review Q3 client retention, celebrate the Lumina Skincare account onboarding, and demonstrate our new MailLens automated workflow. Please submit any discussion items before Wednesday noon.',
    receivedAt: new Date(Date.now() - 1000 * 60 * 720), // 12 hours ago
    isRead: true,
  },
  {
    from: { name: 'Rohan Kapoor', email: 'rohan@stridefootwear.in' },
    subject: 'Action Required: Monthly ROAS & Attribution Report for Festive Sale',
    body: 'Hi account team, We need the comprehensive ROAS and blended customer acquisition breakdown for our festive sale across Myntra, Nykaa, and direct web store. Please send the final analytics proposal and report by Friday afternoon so we can present it at our board meeting in Gurugram.',
    receivedAt: new Date(Date.now() - 1000 * 60 * 900), // 15 hours ago
    isRead: false,
  },
  {
    from: { name: 'Semrush Product Team', email: 'newsletter@semrush.com' },
    subject: 'Product Update: New AI Keyword Cluster Feature is Live',
    body: 'Discover how top digital agencies are grouping high-intent keywords 3x faster with our new clustering algorithm. Join our live masterclass for India agency partners this Tuesday at 3:30 PM IST.',
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
    from: { name: 'Kavita Patel', email: 'kavita@pulsefitness.in' },
    subject: 'Thanks for sharing the weekly campaign report',
    body: 'Thanks for sending over the numbers, team! The cost-per-acquisition across Mumbai and Pune looks solid this week. No immediate changes needed on our end. Keep up the good work!',
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
    const hasOldData = await Email.findOne({ 'from.name': { $in: ['Sarah Jenkins', 'Marcus Vance', 'Elena Rostova'] } });
    if (hasOldData) {
      console.log('[Seed Service] Detected legacy sample data. Re-seeding with updated Indian agency emails...');
      return seedSampleEmails(true);
    }
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
      to: [{ name: 'Khushi Agency Inbound', email: 'inbox@khushiagency.in' }],
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
      from: { name: 'Rajesh Singhania', email: 'rajesh@velocityretail.in' },
      subject: 'URGENT: Budget Cap Reached on Google Shopping - Ads Paused',
      body: 'Hi Khushi Team, our Google Shopping campaign just hit its monthly spend limit early and the ads stopped serving completely across Flipkart & direct store funnels. Can you immediately increase the account cap by ₹5,00,000 and confirm as soon as possible?',
      receivedAt: new Date(),
      isRead: false,
    },
    {
      from: { name: 'Natasha Mehra', email: 'natasha@glamcosmetics.in' },
      subject: 'Inquiry: Looking for Meta & Reels Growth Agency (₹8,00,000/mo budget)',
      body: 'Namaste! We are scaling our Mumbai-based D2C cosmetics brand and need an agency to manage creative strategy and ad spend across Meta and Google Ads. Our monthly ad budget is ₹8,00,000. Please send us your agency pricing packages and case studies by tomorrow.',
      receivedAt: new Date(),
      isRead: false,
    },
    {
      from: { name: 'Accounts & Finance Team', email: 'billing@agencyinternal.in' },
      subject: 'Invoice #4928 Due: Influencer Campaign Festive Deliverables',
      body: 'Reminder that invoice #4928 for ₹95,000 covering creator deliverables for the festive season campaign is due by next Monday. GST breakdown is attached. Please review and approve for NEFT disbursement.',
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
    to: [{ name: 'Khushi Agency Inbound', email: 'inbox@khushiagency.in' }],
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
