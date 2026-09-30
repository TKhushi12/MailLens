import Email from '../models/Email.js';
import { generateAudioBriefText } from '../services/aiService.js';

export const getDashboardMetrics = async (req, res) => {
  try {
    const [
      totalEmails,
      unreadEmails,
      urgentEmails,
      actionRequiredEmails,
      pendingActionCount,
      totalLeads,
      highIntentLeads,
      categoryStats,
      priorityStats,
      recentUrgent,
      upcomingDeadlines,
    ] = await Promise.all([
      Email.countDocuments(),
      Email.countDocuments({ isRead: false }),
      Email.countDocuments({ priority: 'Urgent' }),
      Email.countDocuments({ actionRequired: true }),
      Email.countDocuments({ actionRequired: true, isActionCompleted: false }),
      Email.countDocuments({ isLead: true }),
      Email.countDocuments({ isLead: true, 'leadDetails.intentLevel': 'High' }),

      // Category breakdown aggregation
      Email.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $project: { category: '$_id', count: 1, _id: 0 } },
        { $sort: { count: -1 } },
      ]),

      // Priority breakdown aggregation
      Email.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } },
        { $project: { priority: '$_id', count: 1, _id: 0 } },
      ]),

      // Recent urgent items
      Email.find({ priority: 'Urgent' })
        .sort({ receivedAt: -1 })
        .limit(5)
        .select('from subject summary receivedAt isRead'),

      // Upcoming deadlines
      Email.find({
        actionRequired: true,
        isActionCompleted: false,
        deadline: { $ne: null },
      })
        .sort({ deadline: 1 })
        .limit(5)
        .select('from subject actionTask deadline priority isActionCompleted'),
    ]);

    res.json({
      success: true,
      data: {
        summary: {
          totalEmails,
          unreadEmails,
          urgentEmails,
          actionRequiredEmails,
          pendingActionCount,
          totalLeads,
          highIntentLeads,
        },
        categoryBreakdown: categoryStats,
        priorityBreakdown: priorityStats,
        recentUrgent,
        upcomingDeadlines,
      },
    });
  } catch (err) {
    console.error('Error computing analytics:', err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAudioBrief = async (req, res) => {
  try {
    const [totalCount, urgentCount, pendingCount, leadCount, urgentSample, leadSample] = await Promise.all([
      Email.countDocuments(),
      Email.countDocuments({ priority: 'Urgent' }),
      Email.countDocuments({ actionRequired: true, isActionCompleted: false }),
      Email.countDocuments({ isLead: true }),
      Email.findOne({ priority: 'Urgent' }).select('subject from'),
      Email.findOne({ isLead: true }).select('from leadDetails'),
    ]);

    const script = generateAudioBriefText({
      totalCount,
      urgentCount,
      pendingCount,
      leadCount,
      urgentSample: urgentSample ? urgentSample.subject : '',
      leadSample: leadSample ? `${leadSample.from?.name} for ${leadSample.leadDetails?.serviceInterest || 'services'}` : '',
    });

    res.json({ success: true, script, urgentCount, pendingCount, leadCount });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
