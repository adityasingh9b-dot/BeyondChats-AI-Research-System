

# BeyondChats AI Research & Content Hub

An autonomous AI system that scrapes blogs, performs deep competitor research using **Llama-3.3 (via Groq)**, and displays a comparison of original vs. AI-enhanced content in a professional dashboard.

---

##  Project Architecture & Data Flow

1. **Phase 1 (Ingestion):** `scraper.js` (Node.js) fetches the 5 oldest articles from BeyondChats and sends them to the Laravel CRUD API.
2. **Database:** **Laravel** acts as the bridge, storing all data in **Firebase Realtime Database**.
3. **Phase 2 (AI Enrichment):** `researcher.js` (Node.js) fetches the titles, finds top-ranking competitor blogs via Google, and uses **Llama-3.3-70b** to rewrite the content with proper citations.
4. **Phase 3 (Frontend):** A **React.js** dashboard (deployed on Vercel) displays the data in a responsive UI.

---


* **GitHub Repository:** [https://github.com/adityasingh9b-dot/BeyondChats-AI-Research-System](https://www.google.com/search?q=https://github.com/adityasingh9b-dot/BeyondChats-AI-Research-System)

---

##  Local Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/adityasingh9b-dot/BeyondChats-AI-Research-System.git
cd BeyondChats-AI-Research-System

```

### 2. Phase 1: Backend & Scraping

**A. Setup Laravel API:**

```bash
cd beyond-api
composer install
cp .env.example .env  # Configure your Firebase credentials here
php artisan serve

```

**B. Run Scraper:**

```bash
# In a new terminal (main folder)
node scraper.js

```

*This will fetch the articles and store them in the database.*

### 3. Phase 2: AI Research Script

```bash
# Inside the AI researcher folder
npm install
# Ensure GROQ_API_KEY is in your .env
node researcher.js

```

*This script will perform Google searches and update articles via LLM.*

### 4. Phase 3: Frontend (React)

```bash
cd blog-frontend
npm install
npm start

```

---

## 🛡️ Requirements Checklist (Phase-wise)

* **Phase 1 (Moderate):**  Scraped 5 oldest articles |  Firebase Integration | CRUD APIs.
* **Phase 2 (Very Difficult):**  Google Search Integration |  Competitor Content Scraping |  Llama-3 LLM Implementation |  Automated Citations.
* **Phase 3 (Very Easy):**  Responsive React UI |  Original vs Updated view |  Vercel Deployment.

---

##  Submission Details

* **Candidate:** Aditya Singh
* **Tech Stack:** Laravel, Node.js, React.js, Firebase, Llama-3 (Groq), Puppeteer/Cheerio.

---

