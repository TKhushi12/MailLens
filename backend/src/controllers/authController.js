import User from '../models/User.js';
import { getAuthUrl, exchangeCodeForTokens, syncGmailInbox } from '../services/gmailService.js';

export const getGoogleAuthUrl = (req, res) => {
  if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.json({
      success: true,
      configured: false,
      message: 'Google OAuth credentials not configured in backend .env',
    });
  }

  try {
    const url = getAuthUrl();
    res.json({ success: true, configured: true, url });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const googleCallback = async (req, res) => {
  const { code } = req.query;
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  if (!code) {
    return res.redirect(`${clientUrl}/settings?error=no_code`);
  }

  try {
    const { user } = await exchangeCodeForTokens(code);
    // Optionally trigger initial sync
    try {
      await syncGmailInbox(user, 15);
    } catch (syncErr) {
      console.warn('Initial sync error:', syncErr.message);
    }
    res.redirect(`${clientUrl}/settings?auth_success=true&email=${encodeURIComponent(user.email)}`);
  } catch (err) {
    console.error('OAuth Callback Error:', err);
    res.redirect(`${clientUrl}/settings?error=${encodeURIComponent(err.message)}`);
  }
};

export const getAuthStatus = async (req, res) => {
  try {
    const user = await User.findOne({ 'tokens.access_token': { $exists: true } });
    const isGoogleConfigured = !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
    const isGeminiConfigured = !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim().length > 0);

    res.json({
      success: true,
      googleConfigured: isGoogleConfigured,
      geminiConfigured: isGeminiConfigured,
      connectedUser: user
        ? {
            name: user.name,
            email: user.email,
            picture: user.picture,
            lastSyncedAt: user.lastSyncedAt,
          }
        : null,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const triggerSync = async (req, res) => {
  try {
    const user = await User.findOne({ 'tokens.access_token': { $exists: true } });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'No connected Google account found. Please connect via OAuth or use Demo Mode.',
      });
    }

    const newEmails = await syncGmailInbox(user, 15);
    res.json({
      success: true,
      message: `Successfully synced ${newEmails.length} messages from Gmail.`,
      data: newEmails,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
