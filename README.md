# BeyondChats Full-Stack AI Content Researcher

This project is an end-to-end automated system designed to scrape blog content, perform autonomous competitor research using AI, and display the insights on a modern React dashboard.

## 🌟 Key Features
- **Phase 1 (Scraping):** Automated Node.js scraper to fetch blogs from BeyondChats and store them in Firebase via a Laravel API.
- **Phase 2 (AI Research):** An autonomous Node.js agent that searches Google for competitors, scrapes their content, and uses **Groq (Llama-3.3-70b)** to rewrite articles with citations.
- **Phase 3 (Dashboard):** A responsive React.js UI that allows users to compare original vs. AI-enhanced versions with a professional toggle and detail view.

---

## 🏗️ Project Structure
```text
.
├── ai-researcher/      # Node.js AI Agent (Groq LLM + Google Search)
├── beyond-api/         # Laravel 11 Backend (API + Firebase Integration)
├── blog-frontend/      # React.js Dashboard (Tailwind CSS + Lucide Icons)
├── scraper.js          # Initial Web Scraper for Phase 1
└── serviceAccountKey.json # Firebase Configuration


🛠️ Tech Stack
Frontend: React.js, Tailwind CSS, Lucide React (Icons).

Backend: Laravel 11 (PHP), Firebase Realtime Database.

AI/LLM: Groq Cloud SDK (Llama-3.3-70b-versatile).

Tools: Cheerio (Scraping), Google-it (Search API), Axios.




🚀 Setup & Installation
1. Prerequisites
PHP 8.2+ & Composer

Node.js 18+

Firebase Project (Realtime Database)

Groq API Key (Free tier available)




Backend (Laravel) Setup
Bash

cd beyond-api
composer install
cp .env.example .env
# Update .env with Firebase credentials
php artisan serve
3. AI Researcher Setup
Bash

cd ai-researcher
npm install
# Create a .env file with your GROQ_API_KEY and LARAVEL_API_URL
node researcher.js
4. Frontend (React) Setup
Bash

cd blog-frontend
npm install
npm start
🤖 How the AI Agent Works
Fetch: Retrieves original articles from the database via Laravel.

Search: Uses google-it to find top 2-3 competitor articles for each topic.

Analyze: Scrapes competitor text and feeds it along with the original content into the Llama-3.3-70b model.

Optimize: Generates a new, professional version of the article including a "References" section for citations.

Update: Saves the enhanced version back to the database as a new entry linked to the original.











👨‍💻 Author
Aditya - Full Stack Developer / AI Enthusiast



























