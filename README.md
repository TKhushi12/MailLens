# 📧 MailLens — Autonomous AI Email Operations Platform for Marketing Agencies

[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%2B%20Mongoose-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/AI%20Engine-Gemini%201.5%20Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![Author](https://img.shields.io/badge/Author-Khushi%20Tyagi-8A2BE2)](https://github.com/TKhushi12)

> **MailLens** is an active, autonomous email operations and triage platform engineered specifically for high-growth **Digital Marketing Agencies**. It connects to mail streams, automatically identifies critical ad account crises, calculates disrupted ad spend, generates platform appeal letters, protects agency revenue against scope creep, translates client emails into cross-functional creative briefs, and delivers an executive morning voice debrief.

---

## 🌟 The Core Agency Problem & Solution

Traditional email clients (Gmail, Outlook) are passive messaging tools. In digital marketing agencies, slow email response times lead to severe financial consequences:
* **Ad Account Bans**: A suspended Meta or Google ad account can burn **₹40,000 to ₹1,00,000+ per hour** in lost sales during peak festive campaigns.
* **Scope Creep**: Clients constantly slip in "quick extra favors" outside their retainer agreement, bleeding agency profitability.
* **Messy Client Briefs**: Clients send unstructured paragraphs that account managers spend hours translating into designer and copywriter checklists.

**MailLens** acts as an autonomous digital agency manager that resolves these issues in real time.

---

## ⚡ 4 Signature Autonomous Features

### 1. 🚨 Ad Platform Crisis & Auto-Appeal Generator
* **Automatic Detection**: Immediately intercepts suspension and billing alert emails from Meta Ads and Google Ads.
* **Impact Quantification**: Extracts the impacted Ad Account ID (e.g. `#482-910-2391`) and estimates the daily disrupted spend (e.g. ₹45,000/day).
* **Legal Policy Appeal**: Automatically drafts a formal, legally structured, GSTIN-compliant **Platform Appeal Letter** ready to submit directly to Meta/Google Support with a single click.

### 2. ⚡ 1-Click "Email-to-Campaign Brief" Generator
* Converts unstructured client emails into a comprehensive **Creative Campaign Brief**.
* Formulates campaign objectives, target audience personas, and key deliverables.
* Auto-assigns specific, role-based action items for:
  - 🎨 **Graphic Designer** (Carousel ad sets, color palette guidelines)
  - ✍️ **Copywriter** (High-converting hooks, captions, CTAs)
  - 📊 **Media Buyer** (Meta Pixel tracking, audience targeting, budget pacing)
  - 🤝 **Account Manager** (Milestone QA reviews, timeline sign-offs)

### 3. ⚠️ "Scope Creep" Extra-Work Detector (Agency Revenue Protector)
* Monitors client correspondence for out-of-contract deliverable requests (e.g., ad-hoc landing page changes or weekend flash sale banner redesigns).
* Flags the message with an **amber Scope Creep Alert** explaining why it falls outside the retainer.
* Generates a 1-click **Upsell Quote Draft (₹20,000)** directly inside the reply composer to monetize out-of-scope work.

### 4. 🎧 Morning Executive Audio Briefing (Voice Mode)
* Provides agency founders with a 45-second spoken debrief using the browser's native **Web Speech Synthesis API (`window.speechSynthesis`)**.
* Queries `/api/analytics/audio-brief` to synthesize active crises, pending client deadlines, and hot revenue leads into natural speech.

---

## 🏗️ Architecture & Data Flow

```
                         Inbound Email Stream
                       (Gmail API / Seed Engine)
                                  │
                                  ▼
                     Node.js & Express REST API
                                  │
                  ┌───────────────┴───────────────┐
                  ▼                               ▼
       Google Gemini 1.5 Flash          Internal Heuristic NLP
       (Strict JSON Schema Engine)      (Zero-Downtime Fallback)
                  └───────────────┬───────────────┘
                                  │
                                  ▼
               Enriched Metadata & Action Intelligence
          ┌───────────────────────┼───────────────────────┐
          ▼                       ▼                       ▼
   Category & Urgency     Legal Appeal Letter     Scope Creep Alert
   (Client, Lead, etc.)   & Policy Violation      & Upsell Quote
          └───────────────────────┬───────────────────────┘
                                  │
                                  ▼
                      MongoDB (Mongoose Schemas)
                   (Embedded Sub-document Storage)
                                  │
                                  ▼
                 React 18 + Tailwind CSS Dashboard
                   (Recharts & Web Speech Voice)
```

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Recharts |
| **Backend** | Node.js, Express.js (Modular MVC), RESTful API |
| **Database** | MongoDB, Mongoose (Embedded Polymorphic Schemas), In-Memory Fallback |
| **AI / NLP** | Google Gemini 1.5 Flash SDK, Custom Rule-Based Heuristic NLP Engine |
| **Integrations** | Google OAuth 2.0, Gmail REST API, Web Speech Synthesis API |

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) (v9 or higher)

### Option 1: 1-Click Launcher (Windows)
Double-click **`start.bat`** in the root directory. It will start both backend (Port 5000) and frontend (Port 5173), then open your browser automatically.

### Option 2: Manual Terminal Commands
```bash
# 1. Clone the repository
git clone https://github.com/TKhushi12/MailLens.git
cd MailLens

# 2. Start Backend
cd backend
npm install
npm start

# 3. In a separate terminal, start Frontend
cd ../frontend
npm install
npm run dev
```

Access the dashboard at **`http://localhost:5173`**.

---

## 🌐 Production Deployment Guide

Deploying MailLens to production takes under 10 minutes with free cloud services:

### 1. Database — MongoDB Atlas (Free Forever)
1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create an **M0 Free Cluster**.
3. Under **Database Access**, create a database user and password.
4. Under **Network Access**, add IP `0.0.0.0/0` (allow access from anywhere).
5. Click **Connect > Drivers** and copy your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.mongodb.net/maillens?retryWrites=true&w=majority
   ```

### 2. Backend — Render (Free Web Service)
1. Go to [Render.com](https://render.com/) and create a free account.
2. Click **New + > Web Service** and connect your GitHub repository (`TKhushi12/MailLens`).
3. Set the following settings:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
4. Add **Environment Variables**:
   - `NODE_ENV`: `production`
   - `PORT`: `5000`
   - `MONGODB_URI`: *Your MongoDB Atlas connection string*
   - `GEMINI_API_KEY`: *Your Google AI Studio API key (optional)*
5. Click **Deploy Web Service** and copy your backend URL (e.g. `https://maillens-backend.onrender.com`).

### 3. Frontend — Vercel (Free Hosting)
1. Go to [Vercel.com](https://vercel.com/) and connect your GitHub account.
2. Click **Add New... > Project** and select `MailLens`.
3. Configure project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. Add **Environment Variable**:
   - `VITE_API_URL`: `https://your-backend-name.onrender.com/api`
5. Click **Deploy**. Your agency dashboard is now live on the internet!

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `PORT` | Backend listening port | `5000` |
| `MONGODB_URI` | MongoDB connection URI | Atlas URI or empty for in-memory |
| `GEMINI_API_KEY` | Google Gemini API key | [Google AI Studio](https://aistudio.google.com/app/apikey) |
| `GOOGLE_CLIENT_ID` | OAuth 2.0 Client ID for Gmail | Google Cloud Console |
| `GOOGLE_CLIENT_SECRET` | OAuth 2.0 Client Secret | Google Cloud Console |

### Frontend (`frontend/.env`)
| Variable | Description | Default / Example |
| :--- | :--- | :--- |
| `VITE_API_URL` | Base URL of the backend API | `http://localhost:5000/api` |

---

## 👩‍💻 Author & Attribution

**Khushi Tyagi**
* **GitHub**: [@TKhushi12](https://github.com/TKhushi12)
* **Email**: [khushi.t9525@gmail.com](mailto:khushi.t9525@gmail.com)
* **Project**: MailLens (Agency Operations Platform)

*Built with passion for modern web technologies and autonomous AI engineering.*
