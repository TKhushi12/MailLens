import mongoose from 'mongoose';

const emailSchema = new mongoose.Schema(
  {
    gmailId: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    threadId: {
      type: String,
      index: true,
    },
    from: {
      name: { type: String, default: 'Unknown Sender' },
      email: { type: String, required: true },
    },
    to: [
      {
        name: String,
        email: String,
      },
    ],
    subject: {
      type: String,
      required: true,
      default: '(No Subject)',
    },
    body: {
      type: String,
      required: true,
    },
    snippet: {
      type: String,
      default: '',
    },
    receivedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    isStarred: {
      type: Boolean,
      default: false,
    },

    // AI-Derived Intelligence
    aiProcessed: {
      type: Boolean,
      default: false,
      index: true,
    },
    category: {
      type: String,
      enum: ['Client', 'Lead', 'Marketing', 'Finance', 'Influencer', 'Internal', 'Other'],
      default: 'Other',
      index: true,
    },
    subcategory: {
      type: String,
      default: '',
    },
    priority: {
      type: String,
      enum: ['Urgent', 'Important', 'Normal', 'Low'],
      default: 'Normal',
      index: true,
    },
    priorityReason: {
      type: String,
      default: '',
    },
    summary: {
      type: String,
      default: '',
    },

    // Action & Deadlines
    actionRequired: {
      type: Boolean,
      default: false,
      index: true,
    },
    actionTask: {
      type: String,
      default: '',
    },
    deadline: {
      type: Date,
      default: null,
      index: true,
    },
    isActionCompleted: {
      type: Boolean,
      default: false,
    },

    // Lead Intelligence
    isLead: {
      type: Boolean,
      default: false,
      index: true,
    },
    leadDetails: {
      serviceInterest: { type: String, default: '' },
      intentLevel: { type: String, enum: ['High', 'Medium', 'Low', ''], default: '' },
      estimatedBudget: { type: String, default: '' },
      company: { type: String, default: '' },
    },

    // Suggested Replies
    suggestedReplies: {
      professional: { type: String, default: '' },
      friendly: { type: String, default: '' },
      short: { type: String, default: '' },
    },

    // 🚨 Ad Platform Crisis & Auto-Appeal Intelligence
    policyCrisis: {
      isSuspension: { type: Boolean, default: false },
      platform: { type: String, default: '' },
      accountId: { type: String, default: '' },
      policyViolated: { type: String, default: '' },
      estimatedDailyLoss: { type: String, default: '' },
      appealLetter: { type: String, default: '' },
    },

    // ⚡ 1-Click Campaign Brief & Creative Tasks
    campaignBrief: {
      isGenerated: { type: Boolean, default: false },
      objective: { type: String, default: '' },
      targetAudience: { type: String, default: '' },
      deliverables: [{ type: String }],
      tasks: [
        {
          role: { type: String },
          task: { type: String },
        },
      ],
      timeline: { type: String, default: '' },
      budget: { type: String, default: '' },
    },

    // ⚠️ Scope Creep & Extra-Work Detector
    scopeCreep: {
      detected: { type: Boolean, default: false },
      flaggedItem: { type: String, default: '' },
      reason: { type: String, default: '' },
      suggestedUpsellFee: { type: String, default: '$250' },
      upsellDraft: { type: String, default: '' },
    },
  },
  {
    timestamps: true,
  }
);

// Text indexing for fast search
emailSchema.index({
  subject: 'text',
  body: 'text',
  summary: 'text',
  'from.name': 'text',
  'from.email': 'text',
});

const Email = mongoose.model('Email', emailSchema);
export default Email;
