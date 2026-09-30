import Email from '../models/Email.js';
import { processEmailWithAI, generateCampaignBrief } from '../services/aiService.js';
import { seedSampleEmails, simulateSingleIncomingEmail } from '../services/seedService.js';

export const getEmails = async (req, res) => {
  try {
    const {
      category,
      priority,
      actionRequired,
      isLead,
      isRead,
      isActionCompleted,
      q,
      sort = 'receivedAt',
      order = 'desc',
      limit = 50,
      page = 1,
    } = req.query;

    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }

    if (priority && priority !== 'All') {
      filter.priority = priority;
    }

    if (actionRequired !== undefined && actionRequired !== '') {
      filter.actionRequired = actionRequired === 'true';
    }

    if (isLead !== undefined && isLead !== '') {
      filter.isLead = isLead === 'true';
    }

    if (isRead !== undefined && isRead !== '') {
      filter.isRead = isRead === 'true';
    }

    if (isActionCompleted !== undefined && isActionCompleted !== '') {
      filter.isActionCompleted = isActionCompleted === 'true';
    }

    // Keyword or semantic search
    if (q && q.trim().length > 0) {
      const searchRegex = new RegExp(q.trim(), 'i');
      filter.$or = [
        { subject: searchRegex },
        { body: searchRegex },
        { summary: searchRegex },
        { 'from.name': searchRegex },
        { 'from.email': searchRegex },
        { subcategory: searchRegex },
        { actionTask: searchRegex },
      ];
    }

    const sortObj = {};
    sortObj[sort] = order === 'asc' ? 1 : -1;

    const skip = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const [emails, total] = await Promise.all([
      Email.find(filter)
        .sort(sortObj)
        .skip(skip)
        .limit(parseInt(limit, 10)),
      Email.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: emails,
      pagination: {
        total,
        page: parseInt(page, 10),
        pages: Math.ceil(total / parseInt(limit, 10)),
      },
    });
  } catch (err) {
    console.error('Error fetching emails:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getEmailById = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }
    res.json({ success: true, data: email });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleReadStatus = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }
    email.isRead = req.body.isRead !== undefined ? req.body.isRead : !email.isRead;
    await email.save();
    res.json({ success: true, data: email });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const toggleActionCompleted = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }
    email.isActionCompleted =
      req.body.isActionCompleted !== undefined
        ? req.body.isActionCompleted
        : !email.isActionCompleted;
    await email.save();
    res.json({ success: true, data: email });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const reprocessWithAI = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }

    const aiAnalysis = await processEmailWithAI({
      from: email.from,
      subject: email.subject,
      body: email.body,
      receivedAt: email.receivedAt,
    });

    Object.assign(email, aiAnalysis);
    email.aiProcessed = true;
    await email.save();

    res.json({ success: true, data: email, message: 'AI re-analysis completed.' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const deleteEmail = async (req, res) => {
  try {
    const email = await Email.findByIdAndDelete(req.params.id);
    if (!email) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }
    res.json({ success: true, message: 'Email deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const generateBrief = async (req, res) => {
  try {
    const email = await Email.findById(req.params.id);
    if (!email) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }

    const brief = await generateCampaignBrief(email);
    email.campaignBrief = brief;
    await email.save();

    res.json({ success: true, data: email.campaignBrief, email });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const seedDemo = async (req, res) => {
  try {
    const { force = true } = req.body;
    await seedSampleEmails(force);
    const emails = await Email.find().sort({ receivedAt: -1 });
    res.json({
      success: true,
      message: `Database populated with ${emails.length} agency emails!`,
      data: emails,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const simulateIncoming = async (req, res) => {
  try {
    const newDoc = await simulateSingleIncomingEmail();
    res.json({
      success: true,
      message: 'New incoming email simulated and processed with AI!',
      data: newDoc,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
