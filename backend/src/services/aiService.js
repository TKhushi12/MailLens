import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * Single-pass AI processor for marketing agency emails.
 * Supports Google Gemini API with fallback to intelligent heuristic NLP.
 */

// Heuristic fallback analyzer for offline / zero-API-key testing
export const analyzeWithHeuristics = (emailData) => {
  const { subject = '', body = '', from = {}, receivedAt = new Date() } = emailData;
  const text = `${subject} ${body}`.toLowerCase();
  const refDate = new Date(receivedAt);

  // 1. Category Detection
  let category = 'Other';
  let subcategory = 'General Inquiries';

  if (
    text.includes('quote') ||
    text.includes('pricing') ||
    text.includes('proposal') ||
    text.includes('interested in your service') ||
    text.includes('hire your agency') ||
    text.includes('looking for an agency') ||
    text.includes('budget')
  ) {
    category = 'Lead';
    subcategory = 'New Business Inquiry';
  } else if (
    text.includes('campaign') ||
    text.includes('revision') ||
    text.includes('creatives') ||
    text.includes('deliverables') ||
    text.includes('client meeting') ||
    text.includes('monthly report') ||
    text.includes('our ad account')
  ) {
    category = 'Client';
    subcategory = 'Campaign Management';
  } else if (
    text.includes('collab') ||
    text.includes('influencer') ||
    text.includes('sponsored post') ||
    text.includes('media kit') ||
    text.includes('pr package') ||
    text.includes('instagram reel')
  ) {
    category = 'Influencer';
    subcategory = 'Partnership Pitch';
  } else if (
    text.includes('invoice') ||
    text.includes('payment') ||
    text.includes('bill') ||
    text.includes('receipt') ||
    text.includes('google ads payment') ||
    text.includes('wire transfer') ||
    text.includes('gst')
  ) {
    category = 'Finance';
    subcategory = 'Billing & Payments';
  } else if (
    text.includes('hubspot') ||
    text.includes('meta business suite') ||
    text.includes('mailchimp') ||
    text.includes('semrush') ||
    text.includes('canva') ||
    text.includes('google analytics') ||
    text.includes('zapier')
  ) {
    category = 'Marketing';
    subcategory = 'Platform Notifications';
  } else if (
    from.email?.includes('internal') ||
    from.email?.includes('agency.com') ||
    text.includes('team standup') ||
    text.includes('all-hands') ||
    text.includes('leave application')
  ) {
    category = 'Internal';
    subcategory = 'Team Operations';
  }

  // 2. Priority & Urgency Detection
  let priority = 'Normal';
  let priorityReason = 'Standard day-to-day correspondence.';

  if (
    text.includes('immediately') ||
    text.includes('urgent') ||
    text.includes('asap') ||
    text.includes('stopped running') ||
    text.includes('ad account banned') ||
    text.includes('campaign paused') ||
    text.includes('critical error') ||
    text.includes('emergency')
  ) {
    priority = 'Urgent';
    priorityReason = 'Requires immediate intervention to prevent campaign disruption.';
  } else if (
    category === 'Lead' ||
    text.includes('by tomorrow') ||
    text.includes('deadline') ||
    text.includes('approval needed') ||
    text.includes('review needed')
  ) {
    priority = 'Important';
    priorityReason = 'Action-sensitive business inquiry or client milestone.';
  } else if (
    text.includes('newsletter') ||
    text.includes('webinar') ||
    text.includes('receipt') ||
    category === 'Marketing'
  ) {
    priority = 'Low';
    priorityReason = 'Automated platform notification or informational bulletin.';
  }

  // 3. Action Required & Deadline Extraction
  let actionRequired = false;
  let actionTask = '';
  let deadline = null;

  if (
    text.includes('please send') ||
    text.includes('can you provide') ||
    text.includes('need your feedback') ||
    text.includes('share the report') ||
    text.includes('revised') ||
    text.includes('send us your pricing') ||
    text.includes('reply by') ||
    priority === 'Urgent'
  ) {
    actionRequired = true;
    if (text.includes('send') && text.includes('report')) {
      actionTask = 'Send campaign performance report to client';
    } else if (text.includes('creative') || text.includes('revision')) {
      actionTask = 'Deliver revised campaign creatives';
    } else if (category === 'Lead') {
      actionTask = 'Send service deck and introductory pricing quotation';
    } else if (priority === 'Urgent') {
      actionTask = 'Investigate campaign issue and notify stakeholders';
    } else {
      actionTask = 'Review email request and send confirmation';
    }

    // Heuristic deadline extraction
    if (text.includes('by tomorrow') || text.includes('tomorrow')) {
      const d = new Date(refDate);
      d.setDate(d.getDate() + 1);
      d.setHours(17, 0, 0, 0);
      deadline = d;
    } else if (text.includes('by friday') || text.includes('friday')) {
      const d = new Date(refDate);
      const day = d.getDay();
      const diff = (5 - day + 7) % 7 || 7;
      d.setDate(d.getDate() + diff);
      d.setHours(17, 0, 0, 0);
      deadline = d;
    } else if (text.includes('by monday') || text.includes('monday')) {
      const d = new Date(refDate);
      const day = d.getDay();
      const diff = (1 - day + 7) % 7 || 7;
      d.setDate(d.getDate() + diff);
      d.setHours(17, 0, 0, 0);
      deadline = d;
    } else if (priority === 'Urgent') {
      const d = new Date(refDate);
      d.setHours(d.getHours() + 4);
      deadline = d;
    }
  }

  // 4. Lead Detection
  const isLead = category === 'Lead';
  let leadDetails = {
    serviceInterest: '',
    intentLevel: isLead ? 'High' : '',
    estimatedBudget: '',
    company: from.name || 'Prospective Client',
  };

  if (isLead) {
    if (text.includes('social media')) leadDetails.serviceInterest = 'Social Media Marketing';
    else if (text.includes('seo')) leadDetails.serviceInterest = 'SEO & Organic Growth';
    else if (text.includes('google ads') || text.includes('ppc')) leadDetails.serviceInterest = 'Performance PPC Ads';
    else if (text.includes('influencer')) leadDetails.serviceInterest = 'Influencer Outreach Campaign';
    else leadDetails.serviceInterest = 'Full-Stack Digital Marketing';

    // Check budget mentions
    const budgetMatch = text.match(/(?:budget|around|upto|approx)?\s*(?:₹|\$|usd|inr)\s*([\d,]+(?:\s*(?:k|lakh|cr|crore))?)/i);
    leadDetails.estimatedBudget = budgetMatch ? budgetMatch[0] : '₹3,00,000 - ₹5,00,000 / mo';
  }

  // 5. Summary Generation
  let summary = '';
  if (category === 'Lead') {
    summary = `${from.name || 'Prospective client'} is interested in ${leadDetails.serviceInterest} services and requests pricing/quotation details.`;
  } else if (priority === 'Urgent') {
    summary = `CRITICAL: ${from.name || 'Client'} reports campaign disruption requiring immediate agency response.`;
  } else if (category === 'Client') {
    summary = `${from.name || 'Client'} reached out regarding ongoing campaign status and requested ${actionTask ? actionTask.toLowerCase() : 'an update'}.`;
  } else if (category === 'Finance') {
    summary = `Financial notification regarding billing, payment receipt, or platform invoice.`;
  } else if (category === 'Influencer') {
    summary = `Collaboration inquiry from ${from.name || 'creator'} proposing sponsorship or partnership deliverables.`;
  } else {
    summary = `General message from ${from.name || 'sender'} regarding ${subject}.`;
  }

  // 6. Suggested Replies
  const senderFirstName = (from.name || 'there').split(' ')[0];
  const suggestedReplies = {
    professional: `Dear ${senderFirstName},\n\nThank you for reaching out. We have received your request regarding "${subject}". Our team is already reviewing the details and we will provide a comprehensive update shortly.\n\nBest regards,\nAccount Management Team`,
    friendly: `Hi ${senderFirstName}!\n\nThanks for your note! We're right on it and will make sure this is taken care of right away. Talk to you soon!\n\nCheers,\nMarketing Agency Team`,
    short: `Hi ${senderFirstName},\n\nReceived and noted. We're on it and will follow up with details by the deadline.\n\nThanks!`,
  };

  // 7. 🚨 Ad Platform Crisis & Auto-Appeal Intelligence
  let policyCrisis = {
    isSuspension: false,
    platform: '',
    accountId: '',
    policyViolated: '',
    estimatedDailyLoss: '',
    appealLetter: '',
  };

  if (
    text.includes('ad account') &&
    (text.includes('suspended') || text.includes('disabled') || text.includes('policy violation') || text.includes('unacceptable business practices'))
  ) {
    priority = 'Urgent';
    priorityReason = 'Ad account disabled! Live campaigns halted, causing direct client revenue loss.';
    const isGoogle = text.includes('google');
    const platform = isGoogle ? 'Google Ads' : 'Meta Ads';
    const accountIdMatch = text.match(/#?[\d]{3,4}[- ]?[\d]{3,4}[- ]?[\d]{3,4}/);
    const accountId = accountIdMatch ? accountIdMatch[0] : '#482-910-2391';

    policyCrisis = {
      isSuspension: true,
      platform,
      accountId,
      policyViolated: 'Advertising Policy 4.2 (Unacceptable Business Practices)',
      estimatedDailyLoss: '₹35,000 - ₹65,000 / day',
      appealLetter: `To ${platform} Policy & Compliance Review Team,\n\nRe: Urgent Appeal for Reinstatement of Ad Account ${accountId}\n\nWe are submitting this formal appeal regarding the recent automated suspension citing Policy 4.2. On behalf of our client, we have conducted an immediate audit and confirm the following:\n1. All advertised products are fully licensed and compliant with consumer protection guidelines.\n2. The business registration (GSTIN) and billing details match the corporate entity on file with zero chargeback history.\n3. The landing page URL is secure (HTTPS), with transparent privacy policy and terms of service.\n\nWe respectfully request a manual human re-evaluation to restore active campaigns immediately.\n\nSincerely,\nMedia Buying & Compliance Team\nKhushi Agency`,
    };
  }

  // 7. ⚠️ Scope Creep & Extra-Work Detector
  let scopeCreep = {
    detected: false,
    flaggedItem: '',
    reason: '',
    suggestedUpsellFee: '₹20,000',
    upsellDraft: '',
  };

  if (
    text.includes('quickly redesign') ||
    text.includes('extra banner') ||
    text.includes('website banner') ||
    (text.includes('can you also') && (text.includes('redesign') || text.includes('extra') || text.includes('landing page')))
  ) {
    scopeCreep = {
      detected: true,
      flaggedItem: 'Website & Banner Redesign Request',
      reason: 'Requested deliverable is outside agreed monthly social media & ad creative retainer scope.',
      suggestedUpsellFee: '₹20,000',
      upsellDraft: `Hi ${senderFirstName},\n\nThanks for reaching out! We'd love to help with the website banner redesign for your upcoming festive sale. Since custom website design is outside our core monthly social media retainer, our ad-hoc production rate for this deliverable is ₹20,000. Let us know if you'd like us to add this to this month's invoice and our design team will deliver it right away!\n\nBest,\nKhushi Agency Team`,
    };
  }

  return {
    category,
    subcategory,
    priority,
    priorityReason,
    summary,
    actionRequired,
    actionTask,
    deadline,
    isLead,
    leadDetails,
    suggestedReplies,
    policyCrisis,
    scopeCreep,
  };
};

/**
 * Main AI Analysis Function:
 * Tries Google Gemini API first (single-pass structured output).
 * Gracefully falls back to heuristic engine if no API key or on rate limit.
 */
export const processEmailWithAI = async (emailData) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('YOUR_GEMINI')) {
    console.log('[AI Service] No Gemini API key detected. Using built-in intelligent NLP heuristic engine.');
    return analyzeWithHeuristics(emailData);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const prompt = `
You are an expert AI Email Analyst built into MailLens for a high-growth Digital Marketing Agency.
Analyze the following inbound email thoroughly and output ONLY valid JSON matching the exact schema below.

Email Metadata:
- From: ${emailData.from?.name || ''} <${emailData.from?.email || ''}>
- Subject: ${emailData.subject}
- Body: ${emailData.body}
- Received Timestamp: ${new Date(emailData.receivedAt || Date.now()).toISOString()}

Allowed Categories: ["Client", "Lead", "Marketing", "Finance", "Influencer", "Internal", "Other"]
Allowed Priorities: ["Urgent", "Important", "Normal", "Low"]
- "Urgent" is strictly for active campaign failures, ad account bans, severe client escalations, or immediate crisis (< 24h).
- "Important" is for hot prospective leads, pending contract approvals, or deliverables due within 48 hours.
- "Normal" is regular correspondence.
- "Low" is automated digests, newsletters, receipts.

Relative Deadlines:
If the text mentions relative deadlines like "tomorrow", "this Friday", "next Monday", calculate the exact ISO-8601 string based on the Received Timestamp. If no deadline exists, set deadline to null.

Lead Detection:
If the sender is asking for pricing, proposals, services, or seeking to hire the agency, set isLead: true and extract interest and budget details.

Required JSON Schema:
{
  "category": "Client | Lead | Marketing | Finance | Influencer | Internal | Other",
  "subcategory": "string (e.g. Campaign Revision, SEO Inquiry, Ad Spend Alert)",
  "priority": "Urgent | Important | Normal | Low",
  "priorityReason": "string (brief justification)",
  "summary": "string (1-2 clear sentences summarizing who wants what)",
  "actionRequired": boolean,
  "actionTask": "string (actionable task description or empty string)",
  "deadline": "ISO-8601 date string or null",
  "isLead": boolean,
  "leadDetails": {
    "serviceInterest": "string",
    "intentLevel": "High | Medium | Low | empty string",
    "estimatedBudget": "string",
    "company": "string"
  },
  "suggestedReplies": {
    "professional": "string (formal agency tone)",
    "friendly": "string (warm collaborative tone)",
    "short": "string (crisp 1-2 sentence acknowledgment)"
  }
}
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    const parsed = JSON.parse(responseText);

    // Validate and sanitize parsed deadline
    if (parsed.deadline) {
      const parsedDate = new Date(parsed.deadline);
      parsed.deadline = isNaN(parsedDate.getTime()) ? null : parsedDate;
    }

    // Merge heuristic policyCrisis and scopeCreep checks
    const heuristics = analyzeWithHeuristics(emailData);
    if (!parsed.policyCrisis || !parsed.policyCrisis.isSuspension) {
      parsed.policyCrisis = heuristics.policyCrisis;
    }
    if (!parsed.scopeCreep || !parsed.scopeCreep.detected) {
      parsed.scopeCreep = heuristics.scopeCreep;
    }

    return parsed;
  } catch (err) {
    console.warn('[AI Service] Gemini API call failed or timed out:', err.message, 'Falling back to heuristic engine.');
    return analyzeWithHeuristics(emailData);
  }
};

/**
 * Generate a dynamic custom reply based on chosen tone and user instructions.
 */
export const generateCustomReply = async ({ email, tone = 'professional', customInstructions = '' }) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.trim() === '' || apiKey.includes('YOUR_GEMINI')) {
    const senderName = email.from?.name?.split(' ')[0] || 'there';
    if (tone === 'friendly') {
      return `Hi ${senderName}!\n\nThanks for checking in about "${email.subject}". We've reviewed this with the creative and account team, and we're on track. Let's touch base soon with the deliverables!\n\nBest,\nMarketing Agency Team`;
    } else if (tone === 'short') {
      return `Hi ${senderName},\n\nNoted with thanks. We are reviewing this right now and will get back to you shortly.\n\nBest,\nAccount Team`;
    } else {
      return `Dear ${senderName},\n\nThank you for reaching out regarding "${email.subject}". We have noted all specific requirements and our marketing specialists are actively addressing them.\n\nPlease let us know if you need any additional assistance.\n\nWarm regards,\nClient Services Team`;
    }
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const prompt = `
You are a senior account executive at a top-tier digital marketing agency.
Write an email reply to the following message:

From: ${email.from?.name} <${email.from?.email}>
Subject: ${email.subject}
Original Message: ${email.body}

Desired Tone: ${tone} (e.g. professional, friendly, concise)
Special Agency Instructions: ${customInstructions || 'Acknowledge the email, address the main question, and reassure the client/sender of prompt follow-through.'}

Generate ONLY the email body text. Do not include placeholders like "[Your Name]". Sign off as "Marketing Agency Team".
`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.error('Custom reply generation failed:', err);
    throw err;
  }
};

/**
 * ⚡ 1-Click "Email-to-Campaign Brief" Generator:
 * Converts unstructured client campaign emails into a structured Creative Brief & Team Tasks.
 */
export const generateCampaignBrief = async (emailData) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey && !apiKey.includes('YOUR_GEMINI')) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
        generationConfig: { responseMimeType: 'application/json' },
      });

      const prompt = `
You are a Creative Director & Head of Strategy at a leading digital marketing agency.
Convert the following client email into a comprehensive, structured Creative Campaign Brief.

Client Name: ${emailData.from?.name}
Subject: ${emailData.subject}
Message Body: ${emailData.body}

Return ONLY valid JSON matching this schema:
{
  "objective": "string (clear, high-level campaign goal and value proposition)",
  "targetAudience": "string (demographics, psychographics, and primary persona)",
  "deliverables": [
    "string (specific creative asset, e.g. 3x Instagram Reels in 9:16 format)",
    "string (e.g. 4x Carousel Ad slides highlighting product features)",
    "string (e.g. Google Search ad headlines and copy variations)"
  ],
  "tasks": [
    { "role": "Graphic Designer", "task": "string (exact design deliverable)" },
    { "role": "Copywriter", "task": "string (exact copywriting hooks and caption task)" },
    { "role": "Media Buyer", "task": "string (ad platform setup, tracking pixel, budget pacing)" },
    { "role": "Account Manager", "task": "string (timeline milestone, QA review, and client sign-off)" }
  ],
  "timeline": "string (e.g. Review by Thursday, Go-Live by Friday 5 PM)",
  "budget": "string (e.g. ₹12,00,000 Total Ad Spend + Production)"
}
`;
      const result = await model.generateContent(prompt);
      const parsed = JSON.parse(result.response.text());
      return { isGenerated: true, ...parsed };
    } catch (err) {
      console.warn('Gemini brief generation failed, using intelligent heuristic fallback:', err.message);
    }
  }

  // Robust Heuristic fallback:
  const cleanSubject = emailData.subject.replace(/^(re|fwd|brief|inquiry|feedback):?\s*/i, '');
  return {
    isGenerated: true,
    objective: `${cleanSubject} — Brand Awareness & Multi-Channel Acquisition`,
    targetAudience: 'Urban consumers aged 22-40 seeking premium lifestyle, apparel, and digital solutions with high digital purchase intent.',
    deliverables: [
      '3x High-Converting Short-Form Video Creatives (Instagram Reels / YouTube Shorts)',
      '4x Multi-Slide Carousel Ad Sets Highlighting Core Value Propositions',
      'High-Intent Google Search Ad Headline & Copy Variations',
      'Weekly ROAS & Multi-Touch Attribution Performance Dashboard',
    ],
    tasks: [
      { role: 'Graphic Designer', task: 'Design 4 multi-slide carousel graphics matching brand color palette' },
      { role: 'Copywriter', task: 'Draft 5 high-converting video hooks, captions, and strong call-to-actions' },
      { role: 'Media Buyer', task: 'Configure Meta Pixel conversion tracking, custom audiences, and budget pacing' },
      { role: 'Account Manager', task: 'Review creative proofs with client and obtain final deployment sign-off' },
    ],
    timeline: 'Draft Review within 48 hours, Final Campaign Go-Live by Friday 5 PM',
    budget: emailData.leadDetails?.estimatedBudget || '₹5,00,000 - ₹12,00,000 Media & Production Budget',
  };
};

/**
 * 🎧 Morning Executive Audio Debrief:
 * Synthesizes a natural, professional 45-second audio briefing script for text-to-speech.
 */
export const generateAudioBriefText = ({ totalCount, urgentCount, pendingCount, leadCount, urgentSample, leadSample }) => {
  let urgentPhrase = '';
  if (urgentCount > 0) {
    urgentPhrase = `Attention is required on ${urgentCount} urgent item${urgentCount > 1 ? 's' : ''}, including an ad platform alert regarding ${urgentSample || 'active campaign disruption'}.`;
  } else {
    urgentPhrase = `All advertising accounts and client campaigns are currently operating normally with zero critical escalations.`;
  }

  let leadPhrase = '';
  if (leadCount > 0) {
    leadPhrase = `On the new business front, you have ${leadCount} hot prospective client lead${leadCount > 1 ? 's' : ''} waiting for proposals${leadSample ? `, including ${leadSample}` : ''}.`;
  } else {
    leadPhrase = `Your inbound pipeline is steady with standard retainer accounts active.`;
  }

  return `Good morning Khushi. Here is your executive agency debrief from MailLens. You currently have ${totalCount} total emails in your agency mailbox, with ${pendingCount} client action items pending completion. ${urgentPhrase} ${leadPhrase} All systems are connected and synced. Have a productive day!`;
};

