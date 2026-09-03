import React, { useState } from 'react';
import {
  X,
  Mail,
  Send,
  RefreshCw,
  Sliders,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { replyAPI } from '../services/api';

export default function ReplyComposerModal({
  email,
  initialTone = 'professional',
  initialText = '',
  onClose,
  onReplySent,
}) {
  const [tone, setTone] = useState(initialTone);
  const [replyText, setReplyText] = useState(
    initialText || email.suggestedReplies?.[initialTone] || ''
  );
  const [customInstructions, setCustomInstructions] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [notification, setNotification] = useState(null);

  const handleToneChange = (newTone) => {
    setTone(newTone);
    if (email.suggestedReplies?.[newTone]) {
      setReplyText(email.suggestedReplies[newTone]);
    } else {
      handleRegenerate(newTone);
    }
  };

  const handleRegenerate = async (selectedTone = tone) => {
    setIsGenerating(true);
    try {
      const res = await replyAPI.generateReply({
        emailId: email._id,
        tone: selectedTone,
        customInstructions,
      });
      if (res.success) {
        setReplyText(res.reply);
      }
    } catch (err) {
      console.error('Error generating reply:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSend = async () => {
    if (!replyText.trim()) return;
    setIsSending(true);
    try {
      const res = await replyAPI.sendReply({
        emailId: email._id,
        replyText,
        recipientEmail: email.from.email,
        subject: `Re: ${email.subject}`,
      });

      if (res.success) {
        setNotification({
          type: 'success',
          message: res.message || 'Reply dispatched!',
        });
        setTimeout(() => {
          onReplySent(email._id);
          onClose();
        }, 1200);
      }
    } catch (err) {
      setNotification({
        type: 'error',
        message: err.response?.data?.message || err.message,
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-800">
                Reply Composer
              </h3>
              <p className="text-xs text-slate-500">
                Drafting reply to {email.from.name} &lt;{email.from.email}&gt;
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-200 text-slate-400 hover:text-slate-700 rounded-lg transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tone Selector & Options */}
        <div className="p-5 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
              {[
                { id: 'professional', label: 'Formal / Professional' },
                { id: 'friendly', label: 'Warm & Friendly' },
                { id: 'short', label: 'Concise / Short' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => handleToneChange(t.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    tone === t.id
                      ? 'bg-white text-blue-700 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowInstructions(!showInstructions)}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
              >
                <Sliders className="w-3.5 h-3.5" />
                Custom Prompt Instructions
              </button>

              <button
                type="button"
                onClick={() => handleRegenerate()}
                disabled={isGenerating}
                className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
                <span>{isGenerating ? 'Regenerating...' : 'Regenerate'}</span>
              </button>
            </div>
          </div>

          {/* Optional Prompt Tuning Instruction Input */}
          {showInstructions && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Special Agency Instructions
              </label>
              <input
                type="text"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="e.g. 'Offer a 15% discount if they sign the contract this month', 'Mention we can start on Monday'"
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          )}

          {/* Editable Text Area */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider">Email Content</span>
              <span>You can edit this draft before sending</span>
            </div>
            <textarea
              rows={8}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Type your reply or use AI to draft one..."
              className="w-full p-4 border border-slate-200 rounded-xl text-sm text-slate-800 leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 font-sans"
            />
          </div>

          {/* Notification Alert */}
          {notification && (
            <div
              className={`p-3 rounded-xl flex items-center gap-2 text-xs font-medium ${
                notification.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-rose-50 text-rose-800 border border-rose-200'
              }`}
            >
              {notification.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600" />
              )}
              <span>{notification.message}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-all"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isSending || !replyText.trim()}
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow-md shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
          >
            {isSending ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            <span>{isSending ? 'Sending Reply...' : 'Send Reply via Gmail'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
