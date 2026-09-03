import Email from '../models/Email.js';
import User from '../models/User.js';
import { generateCustomReply } from '../services/aiService.js';
import { sendGmailMessage } from '../services/gmailService.js';

export const generateReply = async (req, res) => {
  try {
    const { emailId, tone = 'professional', customInstructions = '' } = req.body;

    const email = await Email.findById(emailId);
    if (!email) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }

    const replyText = await generateCustomReply({
      email,
      tone,
      customInstructions,
    });

    res.json({
      success: true,
      tone,
      reply: replyText,
    });
  } catch (err) {
    console.error('Error generating reply:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const sendReply = async (req, res) => {
  try {
    const { emailId, replyText, recipientEmail, subject } = req.body;

    const email = await Email.findById(emailId);
    if (!email) {
      return res.status(404).json({ success: false, message: 'Email not found' });
    }

    // Check if user has authenticated with Google OAuth
    const user = await User.findOne({ 'tokens.access_token': { $exists: true } });

    let sentViaGmail = false;
    let gmailResponse = null;

    if (user && user.tokens && user.tokens.access_token) {
      try {
        gmailResponse = await sendGmailMessage({
          user,
          to: recipientEmail || email.from.email,
          subject: subject || `Re: ${email.subject}`,
          body: replyText,
          threadId: email.threadId,
          inReplyTo: email.gmailId,
        });
        sentViaGmail = true;
      } catch (gmailErr) {
        console.warn('Could not send via Gmail API:', gmailErr.message);
      }
    }

    // Mark as read and action completed automatically when reply is sent
    email.isRead = true;
    if (email.actionRequired) {
      email.isActionCompleted = true;
    }
    await email.save();

    res.json({
      success: true,
      sentViaGmail,
      gmailResponse,
      message: sentViaGmail
        ? 'Reply dispatched directly via Gmail API!'
        : 'Reply recorded successfully (Demo Mode / Gmail API not configured)',
      email,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
