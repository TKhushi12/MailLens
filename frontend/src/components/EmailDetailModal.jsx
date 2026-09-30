import React, { useState } from 'react';
import {
  X,
  Clock,
  CheckCircle2,
  FileText,
  MessageSquare,
  Send,
  Calendar,
  Flame,
  User,
  ArrowRight,
  RefreshCw,
  Trash2,
  MailCheck,
  AlertTriangle,
  DollarSign,
  Layers,
  Copy,
  Check,
} from 'lucide-react';
import PriorityBadge from './PriorityBadge';
import CategoryBadge from './CategoryBadge';
import { emailAPI } from '../services/api';

export default function EmailDetailModal({
  email,
  onClose,
  onToggleAction,
  onToggleRead,
  onReprocessAI,
  onOpenReply,
  onDelete,
}) {
  const [isReprocessing, setIsReprocessing] = useState(false);
  const [briefData, setBriefData] = useState(email?.campaignBrief?.isGenerated ? email.campaignBrief : null);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [showAppealModal, setShowAppealModal] = useState(false);
  const [copiedAppeal, setCopiedAppeal] = useState(false);

  if (!email) return null;

  const handleReprocess = async () => {
    setIsReprocessing(true);
    await onReprocessAI(email._id);
    setIsReprocessing(false);
  };

  const handleGenerateBrief = async () => {
    setIsGeneratingBrief(true);
    try {
      const res = await emailAPI.generateBrief(email._id);
      if (res.success && res.data) {
        setBriefData(res.data);
      }
    } catch (err) {
      console.error('Failed to generate campaign brief:', err);
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  const handleCopyAppeal = () => {
    if (email.policyCrisis?.appealLetter) {
      navigator.clipboard.writeText(email.policyCrisis.appealLetter);
      setCopiedAppeal(true);
      setTimeout(() => setCopiedAppeal(false), 2500);
    }
  };

  const formattedDate = new Date(email.receivedAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const deadlineDate = email.deadline
    ? new Date(email.deadline).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      })
    : null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-200 flex items-start justify-between gap-4 bg-slate-50">
            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={email.category} />
                <PriorityBadge priority={email.priority} />
                {email.subcategory && (
                  <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium">
                    {email.subcategory}
                  </span>
                )}
                {email.isLead && (
                  <span className="text-xs bg-rose-50 text-rose-700 border border-rose-200 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-rose-500" />
                    Inbound Retainer Lead
                  </span>
                )}
              </div>

              <h2 className="text-lg font-bold text-slate-900 leading-snug">
                {email.subject}
              </h2>

              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
                <div className="flex items-center gap-1.5 text-slate-800 font-semibold">
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[11px]">
                    {email.from.name ? email.from.name[0].toUpperCase() : 'U'}
                  </div>
                  <span>{email.from.name}</span>
                  <span className="text-slate-400 font-normal">&lt;{email.from.email}&gt;</span>
                </div>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {formattedDate}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleRead(email._id, !email.isRead)}
                title={email.isRead ? 'Mark as unread' : 'Mark as read'}
                className="p-2 hover:bg-slate-200 text-slate-500 rounded-lg transition-all"
              >
                <MailCheck className="w-4 h-4" />
              </button>
              <button
                onClick={handleReprocess}
                disabled={isReprocessing}
                title="Re-run AI analysis"
                className="p-2 hover:bg-slate-200 text-slate-500 rounded-lg transition-all"
              >
                <RefreshCw className={`w-4 h-4 ${isReprocessing ? 'animate-spin text-blue-600' : ''}`} />
              </button>
              <button
                onClick={() => onDelete(email._id)}
                title="Delete email"
                className="p-2 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-lg transition-all"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-lg transition-all ml-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">

            {/* 🚨 1. Critical Ad Platform Suspension Alert */}
            {email.policyCrisis?.isSuspension && (
              <div className="bg-rose-50 border-2 border-rose-300 rounded-xl p-4 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-rose-800 uppercase tracking-wider">
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>Critical Platform Alert: {email.policyCrisis.platform} Account Disabled</span>
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 bg-rose-200 text-rose-900 rounded">
                    {email.policyCrisis.accountId}
                  </span>
                </div>
                <div className="text-xs text-rose-800 space-y-1 bg-white/70 p-3 rounded-lg border border-rose-200">
                  <p><strong>Policy Violation:</strong> {email.policyCrisis.policyViolated}</p>
                  <p><strong>Estimated Daily Spend Disrupted:</strong> <span className="font-bold text-rose-900">{email.policyCrisis.estimatedDailyLoss}</span></p>
                </div>
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-rose-200">
                  <span className="text-[11px] text-rose-700 font-medium">Official compliance appeal pre-drafted and ready for review</span>
                  <button
                    onClick={() => setShowAppealModal(true)}
                    className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <FileText className="w-3.5 h-3.5" />
                    <span>⚡ View Official Appeal Letter</span>
                  </button>
                </div>
              </div>
            )}

            {/* ⚠️ 2. Scope Creep Alert Card */}
            {email.scopeCreep?.detected && (
              <div className="bg-amber-50 border border-amber-300 rounded-xl p-4 space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 uppercase tracking-wider">
                    <DollarSign className="w-4 h-4 text-amber-700 shrink-0" />
                    Scope Creep Warning: Extra Work Detected
                  </div>
                  <span className="text-xs font-bold bg-amber-200 text-amber-900 px-2.5 py-0.5 rounded-full">
                    Suggested Fee: {email.scopeCreep.suggestedUpsellFee}
                  </span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed">
                  <strong>Flagged Deliverable:</strong> {email.scopeCreep.flaggedItem} — {email.scopeCreep.reason}
                </p>
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-amber-200">
                  <span className="text-[11px] text-amber-700">Protect agency retainer revenue with a polite upsell quote</span>
                  <button
                    onClick={() => onOpenReply(email, 'professional', email.scopeCreep.upsellDraft)}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Upsell Quote ({email.scopeCreep.suggestedUpsellFee})</span>
                  </button>
                </div>
              </div>
            )}

            {/* Summary Overview Block */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <FileText className="w-4 h-4 text-slate-500" />
                  Email Summary
                </div>
                {email.priorityReason && (
                  <span className="text-[11px] text-slate-500 italic">
                    Note: {email.priorityReason}
                  </span>
                )}
              </div>
              <p className="text-sm font-medium text-slate-800 leading-relaxed">
                {email.summary || 'Summary is being generated...'}
              </p>

              {/* Action Item & Deadline Bar */}
              {email.actionRequired && (
                <div className="mt-3 pt-3 border-t border-blue-200/60 flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
                  <div className="flex items-start gap-2.5">
                    <button
                      onClick={() => onToggleAction(email._id, !email.isActionCompleted)}
                      className="mt-0.5 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      {email.isActionCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 hover:border-blue-500" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase text-slate-700">Action Required:</span>
                        <span className={`text-sm font-semibold ${email.isActionCompleted ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                          {email.actionTask || 'Follow up with client'}
                        </span>
                      </div>
                      {deadlineDate && (
                        <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium mt-0.5">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Deadline: {deadlineDate}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onToggleAction(email._id, !email.isActionCompleted)}
                    className={`text-xs px-2.5 py-1 rounded-md font-semibold transition-all ${
                      email.isActionCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {email.isActionCompleted ? 'Completed ✓' : 'Mark Done'}
                  </button>
                </div>
              )}

              {/* Potential Lead Metadata Card */}
              {email.isLead && email.leadDetails && (
                <div className="mt-3 pt-3 border-t border-rose-200/60 bg-rose-50/50 p-3 rounded-lg border border-rose-100 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4 text-rose-600" />
                    <span className="text-xs font-bold text-rose-900 uppercase">Lead Details:</span>
                    <span className="text-xs text-rose-800 font-medium">
                      {email.leadDetails.serviceInterest}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
                    {email.leadDetails.estimatedBudget && (
                      <span>💰 Budget: <strong className="text-slate-900">{email.leadDetails.estimatedBudget}</strong></span>
                    )}
                    {email.leadDetails.intentLevel && (
                      <span>🔥 Intent: <strong className="text-rose-700">{email.leadDetails.intentLevel}</strong></span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* ⚡ 3. 1-Click Creative Campaign Brief Generator */}
            {(email.category === 'Client' || email.category === 'Lead') && (
              <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-800 uppercase tracking-wider">
                    <Layers className="w-4 h-4 text-blue-600" />
                    Creative Campaign Brief & Tasks
                  </div>
                  {!briefData && (
                    <button
                      onClick={handleGenerateBrief}
                      disabled={isGeneratingBrief}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingBrief ? 'animate-spin' : ''}`} />
                      <span>{isGeneratingBrief ? 'Extracting Brief...' : '⚡ Generate Campaign Brief'}</span>
                    </button>
                  )}
                </div>

                {briefData ? (
                  <div className="space-y-3 pt-1 text-xs">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 space-y-1.5">
                      <p><strong className="text-slate-800">Campaign Objective:</strong> <span className="text-slate-700">{briefData.objective}</span></p>
                      <p><strong className="text-slate-800">Target Audience:</strong> <span className="text-slate-700">{briefData.targetAudience}</span></p>
                      {briefData.timeline && <p><strong className="text-slate-800">Timeline:</strong> <span className="text-slate-700">{briefData.timeline}</span></p>}
                    </div>

                    <div>
                      <p className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">Deliverables Checklist:</p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {briefData.deliverables?.map((del, i) => (
                          <div key={i} className="flex items-center gap-2 p-2 bg-blue-50/60 rounded-lg border border-blue-100 text-slate-700">
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                            <span className="font-medium">{del}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1.5">Team Role Task Breakdown:</p>
                      <div className="space-y-1.5">
                        {briefData.tasks?.map((t, i) => (
                          <div key={i} className="flex items-start gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                            <span className="font-bold text-blue-700 min-w-[120px] shrink-0">{t.role}:</span>
                            <span className="text-slate-600 flex-1">{t.task}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    Transform this client request into a structured creative campaign brief with tasks for designers, copywriters, and media buyers.
                  </p>
                )}
              </div>
            )}

            {/* Original Email Body */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider">
                Original Message
              </h4>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 text-sm text-slate-700 leading-relaxed whitespace-pre-line font-normal">
                {email.body}
              </div>
            </div>

            {/* Suggested Replies Quick Preview */}
            {email.suggestedReplies && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
                    Suggested Quick Replies
                  </h4>
                  <span className="text-[11px] text-slate-400">Click to load & edit draft</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {['professional', 'friendly', 'short'].map((tone) => {
                    const replyText = email.suggestedReplies[tone];
                    if (!replyText) return null;
                    return (
                      <button
                        key={tone}
                        onClick={() => onOpenReply(email, tone, replyText)}
                        className="text-left p-3 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/40 bg-white transition-all group flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 group-hover:text-blue-700">
                              {tone}
                            </span>
                            <Send className="w-3 h-3 text-slate-300 group-hover:text-blue-500" />
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                            {replyText}
                          </p>
                        </div>
                        <span className="text-[11px] font-semibold text-blue-600 mt-2 flex items-center gap-1">
                          Use Reply <ArrowRight className="w-3 h-3" />
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
            <div className="text-xs text-slate-400">
              MailLens Agency Workspace • Auto-categorized
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-all"
              >
                Close
              </button>
              <button
                onClick={() => onOpenReply(email, 'professional', email.suggestedReplies?.professional)}
                className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm flex items-center gap-1.5 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                Reply to {email.from.name.split(' ')[0]}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Appeal Letter Modal */}
      {showAppealModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-rose-50/60">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-rose-100 text-rose-700">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Official Ad Policy Appeal Letter
                  </h3>
                  <p className="text-xs text-slate-500">
                    Ready to submit to {email.policyCrisis?.platform} Support for Account {email.policyCrisis?.accountId}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowAppealModal(false)}
                className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 font-mono text-xs text-slate-800 leading-relaxed whitespace-pre-wrap max-h-96 overflow-y-auto">
                {email.policyCrisis?.appealLetter}
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs text-slate-500">
                  Cites Policy 4.2 compliance and business registration proofs.
                </span>
                <button
                  onClick={handleCopyAppeal}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-sm"
                >
                  {copiedAppeal ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedAppeal ? 'Copied to Clipboard!' : 'Copy Appeal Letter'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
