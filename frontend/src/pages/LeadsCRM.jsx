import React from 'react';
import {
  Flame,
  DollarSign,
  Briefcase,
  Mail,
  Send,
  ExternalLink,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import PriorityBadge from '../components/PriorityBadge';

export default function LeadsCRM({
  emails,
  onSelectEmail,
  onOpenReply,
}) {
  const leads = emails.filter((e) => e.isLead);
  const highIntentCount = leads.filter((e) => e.leadDetails?.intentLevel === 'High').length;

  return (
    <div className="space-y-6">
      {/* Header & CRM KPI Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-50 text-rose-600">
              <Flame className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">
              Agency Inbound Leads & New Business
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-xl">
            Track prospective clients asking for pricing, capabilities decks, and marketing retainers.
          </p>
        </div>

        {/* Lead Stats Pill */}
        <div className="flex items-center gap-3">
          <div className="bg-rose-50 border border-rose-100 px-4 py-2.5 rounded-xl text-center">
            <span className="text-[11px] font-bold text-rose-600 uppercase tracking-wider block">
              Total Inbound Leads
            </span>
            <span className="text-xl font-extrabold text-rose-900">{leads.length}</span>
          </div>
          <div className="bg-amber-50 border border-amber-100 px-4 py-2.5 rounded-xl text-center">
            <span className="text-[11px] font-bold text-amber-700 uppercase tracking-wider block">
              High-Intent Inquiries
            </span>
            <span className="text-xl font-extrabold text-amber-900">{highIntentCount}</span>
          </div>
        </div>
      </div>

      {/* Leads List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {leads.length === 0 ? (
          <div className="col-span-2 bg-white rounded-2xl p-16 text-center text-slate-400 border border-slate-200">
            <Flame className="w-12 h-12 mx-auto text-slate-300 mb-2" />
            <h4 className="text-base font-semibold text-slate-700">No leads currently detected</h4>
            <p className="text-xs text-slate-400 mt-1">
              Click "+ Simulate Inbound Email" on the top right to simulate high-intent inquiries.
            </p>
          </div>
        ) : (
          leads.map((email) => {
            const lead = email.leadDetails || {};
            const receivedDate = new Date(email.receivedAt).toLocaleDateString([], {
              month: 'short',
              day: 'numeric',
            });

            return (
              <div
                key={email._id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Lead Header */}
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-base font-bold text-slate-900">
                          {email.from.name}
                        </span>
                        <span className="text-xs font-semibold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Flame className="w-3 h-3 text-rose-500" />
                          {lead.intentLevel || 'High'} Intent
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{email.from.email}</p>
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{receivedDate}</span>
                  </div>

                  {/* Service & Budget Tags */}
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200 px-2.5 py-1 rounded-lg">
                      <Briefcase className="w-3.5 h-3.5" />
                      {lead.serviceInterest || 'Digital Marketing'}
                    </span>
                    {lead.estimatedBudget && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-1 rounded-lg">
                        <DollarSign className="w-3.5 h-3.5" />
                        {lead.estimatedBudget}
                      </span>
                    )}
                  </div>

                  {/* AI Summary of Lead Need */}
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-3.5 space-y-1">
                    <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Request Summary
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {email.summary || email.body.substring(0, 140)}
                    </p>
                  </div>
                </div>

                {/* Bottom Actions: View message & Draft Quote */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onSelectEmail(email)}
                    className="text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    View Full Thread
                  </button>

                  <button
                    onClick={() => onOpenReply(email, 'professional', email.suggestedReplies?.professional)}
                    className="px-3.5 py-2 bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-700 hover:to-indigo-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Proposal / Deck
                  </button>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
