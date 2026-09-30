import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 30000,
});

export const emailAPI = {
  getEmails: async (params = {}) => {
    const res = await api.get('/emails', { params });
    return res.data;
  },

  getEmailById: async (id) => {
    const res = await api.get(`/emails/${id}`);
    return res.data;
  },

  toggleRead: async (id, isRead) => {
    const res = await api.patch(`/emails/${id}/read`, { isRead });
    return res.data;
  },

  toggleActionCompleted: async (id, isActionCompleted) => {
    const res = await api.patch(`/emails/${id}/action`, { isActionCompleted });
    return res.data;
  },

  reprocessAI: async (id) => {
    const res = await api.post(`/emails/${id}/reprocess`);
    return res.data;
  },

  deleteEmail: async (id) => {
    const res = await api.delete(`/emails/${id}`);
    return res.data;
  },

  seedDemoEmails: async (force = true) => {
    const res = await api.post('/emails/seed', { force });
    return res.data;
  },

  simulateIncoming: async () => {
    const res = await api.post('/emails/simulate');
    return res.data;
  },

  generateBrief: async (id) => {
    const res = await api.post(`/emails/${id}/brief`);
    return res.data;
  },
};

export const replyAPI = {
  generateReply: async ({ emailId, tone = 'professional', customInstructions = '' }) => {
    const res = await api.post('/replies/generate', {
      emailId,
      tone,
      customInstructions,
    });
    return res.data;
  },

  sendReply: async ({ emailId, replyText, recipientEmail, subject }) => {
    const res = await api.post('/replies/send', {
      emailId,
      replyText,
      recipientEmail,
      subject,
    });
    return res.data;
  },
};

export const analyticsAPI = {
  getMetrics: async () => {
    const res = await api.get('/analytics');
    return res.data;
  },

  getAudioBrief: async () => {
    const res = await api.get('/analytics/audio-brief');
    return res.data;
  },
};

export const authAPI = {
  getStatus: async () => {
    const res = await api.get('/auth/status');
    return res.data;
  },

  getGoogleAuthUrl: async () => {
    const res = await api.get('/auth/google/url');
    return res.data;
  },

  triggerSync: async () => {
    const res = await api.post('/auth/sync');
    return res.data;
  },
};

export default api;
