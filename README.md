

# BeyondChats AI Research & Content Hub

An autonomous AI system designed to scrape blogs, perform deep competitor research using **Llama-3.3 (via Groq)**, and present a side-by-side comparison of original vs. AI-enhanced content.

---

## 🏗️ Architecture & Data Flow

The system follows a 3-tier architecture with an integrated AI Research layer:

1. **Ingestion Phase (Phase 1):** A Node.js scraper fetches the oldest 5 articles from BeyondChats and pushes them to the **Laravel API**.
2. **Storage Layer:** Laravel manages the data flow and persists articles in a **Firebase Realtime Database**.
3. **Research & Enrichment Phase (Phase 2):** * The Node.js script fetches original titles.
* It performs a **Google Search** to find top-ranking competitor blogs.
* It scrapes the competitor content and feeds it into the **Llama-3.3-70b LLM**.
* The LLM rewrites the article for better formatting/depth and includes **auto-generated citations**.


4. **Presentation Phase (Phase 3):** A **React.js** dashboard fetches both versions and displays them in a responsive, side-by-side comparison UI.

---

## 🛠️ Local Setup Instructions

### 1. Prerequisites

* PHP 8.x & Composer (for Laravel)
* Node.js & npm (for AI Agent & React)
* Firebase Account

### 2. Backend (Laravel API)

```bash
cd beyond-api
composer install
cp .env.example .env
# Configure FIREBASE_DATABASE_URL in .env
php artisan serve

```

### 3. AI Researcher (Node.js Agent)

```bash
cd ai-researcher
npm install
# Add your GROQ_API_KEY in .env
node researcher.js

```

### 4. Frontend (React)

```bash
cd blog-frontend
npm install
npm start

```

---

## 🛡️ Features Implemented

* ✅ **Automated Scraping:** Fetches oldest 5 articles dynamically.
* ✅ **Competitor Research:** Programmatic Google Search for top 2 ranking articles.
* ✅ **AI Content Enhancement:** Llama-3-70b model used for rewriting.
* ✅ **Auto-Citations:** Automatic reference links added to enhanced articles.
* ✅ **Professional UI:** Responsive React dashboard with original/enhanced toggle.
* ✅ **Real-time Sync:** Powered by Firebase.

---

## 👨‍💻 Submission By

**Aditya Singh** *Full Stack Web Developer Intern Applicant*

---

