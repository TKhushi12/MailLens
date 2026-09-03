import { google } from 'googleapis';
import Email from '../models/Email.js';
import User from '../models/User.js';
import { processEmailWithAI } from './aiService.js';

const SCOPES = [
  'https://www.googleapis.com/auth/gmail.readonly',
  'https://www.googleapis.com/auth/gmail.send',
  'https://www.googleapis.com/auth/gmail.modify',
  'https://www.googleapis.com/auth/userinfo.email',
  'https://www.googleapis.com/auth/userinfo.profile',
];

export const getOAuth2Client = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
};

export const getAuthUrl = () => {
  const oauth2Client = getOAuth2Client();
  return oauth2Client.generateAuthUrl({
    access_type: 'offline',
    prompt: 'consent',
    scope: SCOPES,
  });
};

export const exchangeCodeForTokens = async (code) => {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  oauth2Client.setCredentials(tokens);

  // Retrieve user info
  const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
  const { data: userInfo } = await oauth2.userinfo.get();

  // Save or update user in database
  let user = await User.findOne({ email: userInfo.email });
  if (!user) {
    user = new User({
      googleId: userInfo.id,
      email: userInfo.email,
      name: userInfo.name || 'Agency Member',
      picture: userInfo.picture,
      tokens,
    });
  } else {
    user.tokens = tokens;
    user.googleId = userInfo.id;
    if (userInfo.picture) user.picture = userInfo.picture;
    if (userInfo.name) user.name = userInfo.name;
  }
  await user.save();

  return { user, tokens };
};

// Recursive helper to extract body text from multipart Gmail message payload
const extractBodyFromPayload = (payload) => {
  if (!payload) return '';

  if (payload.body && payload.body.data) {
    return Buffer.from(payload.body.data, 'base64').toString('utf-8');
  }

  if (payload.parts && payload.parts.length > 0) {
    // Prefer text/plain if available, otherwise take text/html
    const plainPart = payload.parts.find((p) => p.mimeType === 'text/plain');
    if (plainPart && plainPart.body && plainPart.body.data) {
      return Buffer.from(plainPart.body.data, 'base64').toString('utf-8');
    }

    const htmlPart = payload.parts.find((p) => p.mimeType === 'text/html');
    if (htmlPart && htmlPart.body && htmlPart.body.data) {
      const html = Buffer.from(htmlPart.body.data, 'base64').toString('utf-8');
      // Strip HTML tags for clean text
      return html.replace(/<[^>]*>?/gm, ' ').replace(/\s+/g, ' ').trim();
    }

    // Recurse deeper if parts have sub-parts
    for (const part of payload.parts) {
      const subBody = extractBodyFromPayload(part);
      if (subBody) return subBody;
    }
  }

  return '';
};

// Parse email header value by name
const getHeader = (headers, name) => {
  const header = headers.find((h) => h.name.toLowerCase() === name.toLowerCase());
  return header ? header.value : '';
};

// Parse "Name <email@domain.com>" string
const parseSender = (senderString) => {
  if (!senderString) return { name: 'Unknown', email: 'unknown@example.com' };
  const match = senderString.match(/(.*)<(.*)>/);
  if (match) {
    return {
      name: match[1].trim().replace(/^["']|["']$/g, '') || match[2].trim(),
      email: match[2].trim(),
    };
  }
  return { name: senderString.trim(), email: senderString.trim() };
};

/**
 * Syncs recent emails from Gmail and processes them through the AI pipeline.
 */
export const syncGmailInbox = async (user, maxResults = 10) => {
  if (!user || !user.tokens || !user.tokens.access_token) {
    throw new Error('User not authenticated with Google OAuth.');
  }

  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials(user.tokens);

  // Auto-refresh token listener
  oauth2Client.on('tokens', async (tokens) => {
    if (tokens.refresh_token) {
      user.tokens.refresh_token = tokens.refresh_token;
    }
    user.tokens.access_token = tokens.access_token;
    user.tokens.expiry_date = tokens.expiry_date;
    await user.save();
  });

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  // List recent messages in INBOX
  const listRes = await gmail.users.messages.list({
    userId: 'me',
    maxResults,
    q: 'label:INBOX',
  });

  const messages = listRes.data.messages || [];
  const processedEmails = [];

  for (const item of messages) {
    // Check if already stored
    const existing = await Email.findOne({ gmailId: item.id });
    if (existing) {
      processedEmails.push(existing);
      continue;
    }

    // Fetch full message details
    const msgRes = await gmail.users.messages.get({
      userId: 'me',
      id: item.id,
      format: 'full',
    });

    const msg = msgRes.data;
    const headers = msg.payload?.headers || [];

    const fromHeader = getHeader(headers, 'From');
    const toHeader = getHeader(headers, 'To');
    const subject = getHeader(headers, 'Subject') || '(No Subject)';
    const dateHeader = getHeader(headers, 'Date');
    const receivedAt = dateHeader ? new Date(dateHeader) : new Date(parseInt(msg.internalDate, 10));

    const sender = parseSender(fromHeader);
    const body = extractBodyFromPayload(msg.payload) || msg.snippet || '';

    // Run AI pipeline
    const aiAnalysis = await processEmailWithAI({
      from: sender,
      subject,
      body,
      receivedAt,
    });

    // Save to database
    const newEmail = new Email({
      gmailId: msg.id,
      threadId: msg.threadId,
      from: sender,
      to: [{ name: '', email: toHeader }],
      subject,
      body,
      snippet: msg.snippet || body.substring(0, 150),
      receivedAt,
      isRead: !msg.labelIds?.includes('UNREAD'),
      aiProcessed: true,
      ...aiAnalysis,
    });

    await newEmail.save();
    processedEmails.push(newEmail);
  }

  user.lastSyncedAt = new Date();
  await user.save();

  return processedEmails;
};

/**
 * Send an email or reply through Gmail API
 */
export const sendGmailMessage = async ({ user, to, subject, body, threadId, inReplyTo }) => {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials(user.tokens);

  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  const headers = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/plain; charset=utf-8',
    'MIME-Version: 1.0',
  ];

  if (inReplyTo) {
    headers.push(`In-Reply-To: ${inReplyTo}`);
    headers.push(`References: ${inReplyTo}`);
  }

  const emailRaw = `${headers.join('\r\n')}\r\n\r\n${body}`;
  const encodedEmail = Buffer.from(emailRaw)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  const sendRes = await gmail.users.messages.send({
    userId: 'me',
    requestBody: {
      raw: encodedEmail,
      threadId: threadId || undefined,
    },
  });

  return sendRes.data;
};
