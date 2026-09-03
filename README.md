# 📧 MailLens — Email Management for Marketing Agencies

> An automated email management and triage platform built specifically for digital marketing agencies. Connects to Gmail, categorizes incoming traffic, flags critical campaign alerts, tracks deadlines, and suggests contextual replies.

---

## 🌟 Key Highlights & Innovations

1. **Dual-Mode Architecture**:
   - **Production Mode**: Integrates directly with Google Workspace using **Google OAuth 2.0** and the **Gmail API** to fetch and send messages.
   - **Interactive Presentation / Demo Mode**: Features an instant **"Simulate Inbound Email"** engine that tests real-time AI ingestion with realistic marketing scenarios (ad account suspension, high-value retainers, creative revisions, invoices).
2. **Zero-Configuration In-Memory MongoDB**:
   - Automatically connects to external MongoDB (`MONGODB_URI`) or gracefully spawns an in-memory instance via `mongodb-memory-server` if local MongoDB is not installed. Runs out-of-the-box on any machine!
3. **Single-Pass AI Inference (Google Gemini + Intelligent Fallback)**:
   - Eliminates redundant API latency by extracting Category, Priority, Summary, Action Item, Deadline, and Suggested Replies in a single structured JSON response.
   - Includes a high-accuracy heuristic NLP engine that continues functioning even without an API key or when offline.
4. **Agile Agency Dashboard**:
   - Visual analytics powered by **Recharts** displaying category share, urgency ratios, and estimated manual labor time saved.

---

## 🏗️ Architecture & Data Flow

```
                     Gmail Server
                          ↓
              Google OAuth 2.0 & Gmail API
                          ↓
              Node.js + Express Server
                          ↓
         Single-Pass AI Engine (Gemini / Heuristic)
         ┌────────────────┼────────────────┐
         ↓                ↓                ↓
   Category & Sub    Urgency Level    Action Required &
   (Client, Lead,    (🔴 Urgent to    Extracted Deadline
   Finance, etc.)    🟢 Low)          (Temporal ISO-8601)
         └────────────────┬────────────────┘
                          ↓
                 MongoDB (Mongoose)
                          ↓
             React + Tailwind CSS Dashboard
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Run with Single Click (Windows)
Double-click `start.bat` in the root folder, or run:
```bash
# Terminal 1: Backend
cd backend
npm install
npm start

# Terminal 2: Frontend
cd frontend
npm install
npm run dev
```

Open your browser at **`http://localhost:5173`**.

---

## 🔑 Optional: Live Cloud Integrations

### 1. Google Gemini AI API
1. Get a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).
2. Open `backend/.env` and paste:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
*(If omitted, SmartMail automatically runs its built-in heuristic NLP engine.)*

### 2. Google OAuth 2.0 & Live Gmail Sync
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project and enable the **Gmail API**.
3. Under **APIs & Services > Credentials**, create an **OAuth 2.0 Client ID** (Web application).
4. Add Authorized redirect URI: `http://localhost:5000/api/auth/google/callback`.
5. Open `backend/.env` and paste:
   ```env
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   ```

---

## 🎓 Teacher / Viva Presentation Guide

### 1. Elevator Pitch (Say this to your teacher):
> *"SmartMail solves the high-volume email overwhelm experienced by marketing agencies. Instead of manual sorting, our system connects to Gmail via OAuth 2.0, decodes multipart MIME emails, and passes them through a single-pass Gemini LLM pipeline. The AI extracts structured metadata: category, priority, executive summary, deadlines, and prospective retainers, visualized in an interactive React command center."*

### 2. Live Demo Script (Step-by-Step):
1. **Show the Dashboard**: Highlight the top KPI cards (*Total Inbound, Urgent Incidents, Action Items, New Leads*) and the Recharts category breakdown.
2. **Demonstrate Real-Time AI Ingestion**: Click the **"+ Simulate Inbound Email"** button in the top navbar. Point out how a brand new email arrives, is instantly analyzed, and triggers live urgency badges.
3. **Open the "Needs Attention" Tab**: Show how AI extracted the action task and calculated relative deadlines (*"Due in 2 days"*, *"Due tomorrow"*). Check off a task to show state persistence.
4. **Open the "Leads CRM" Tab**: Show how prospective client inquiries are separated, detailing requested services (*"Performance PPC Ads"*), and budget signals (*"$25,000 budget"*).
5. **Demonstrate AI Reply Suggestions**: Click any email and show the 3 tone drafts (*Professional*, *Friendly*, *Short*). Click *"Send Proposal / Deck"* to demonstrate one-click dispatch.

---

## 💡 Top Viva Questions & Answers

* **Q: Did you train your own model or use an API?**
  * *A: We engineered structured prompts on a foundation LLM (Gemini 1.5 Flash). In real-world enterprise applications, email reasoning involves nuanced sentiment, implied deadlines, and contract terminology where zero-shot LLM prompts with JSON schema constraints vastly outperform small custom classifiers without requiring expensive GPU training clusters.*
* **Q: Doesn't calling AI on every page load make it slow?**
  * *A: No. AI inference happens once during ingestion. The enriched metadata is indexed in MongoDB, so all dashboard and inbox queries execute in milliseconds from the database.*
* **Q: How are relative dates like "by this Friday" handled?**
  * *A: In the AI prompt, we pass the email's received timestamp as an anchor reference, instructing the model to calculate the absolute ISO-8601 date.*
