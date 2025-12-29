require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const googleIt = require('google-it');
const Groq = require("groq-sdk");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function scrapeCompetitor(url)
{
    try
    {
        const { data } = await axios.get(url, { 
            timeout: 5000,
            headers: { 'User-Agent': 'Mozilla/5.0' } 
        });
        
        const $ = cheerio.load(data);
        
        return $('p').text().substring(0, 1500); 
    }
    
    catch (e) { return ""; }
}

async function startResearch()
{
    try {
        console.log(" Fetching articles from Laravel...");
        const response = await axios.get(process.env.LARAVEL_API_URL);
        const articles = response.data;

        for (let id in articles) {
            const article = articles[id];

            // FIX 1: Sirf un articles ko research karo jo pehle se AI Enhanced nahi hain
            // Taaki unnecessary tokens waste na hon aur loop na bane
            if (article.title.includes("(AI Enhanced)")) {
                console.log(`Skipping: ${article.title} (Already Optimized)`);
                continue;
            }

            console.log(`\n Researching: ${article.title}`);

            // Google Search
            const results = await googleIt({ query: article.title });
            const competitors = results.filter(r => !r.link.includes('beyondchats.com')).slice(0, 2);
            
            let competitorContent = "";
            let citations = [];

            for (let comp of competitors) {
                console.log(`   Scraping: ${comp.link}`);
                const text = await scrapeCompetitor(comp.link);
                competitorContent += text + "\n\n";
                citations.push(comp.link);
            }

            // AI Call (Groq - Llama 3)
            console.log(" Asking Llama-3 (Groq) to rewrite...");
            const chatCompletion = await groq.chat.completions.create({
                messages: [
                    { role: "system", content: "You are a professional content enhancer. Always provide a clear 'References' section at the end with the provided links." },
                    { role: "user", content: `Original Article: ${article.content}\n\nCompetitor Research: ${competitorContent}\n\nTask: Rewrite the article to be more professional and detailed. Add these links in a 'References' section at the end: ${citations.join(", ")}` }
                ],
                model: "llama-3.3-70b-versatile",
            });

            const newContent = chatCompletion.choices[0].message.content;

            // FIX 2: Pakka karna ki URL pass ho rahi hai
            // Agar article.url missing hai toh BeyondChats ka general link use karega
            const finalUrl = article.url || "https://beyondchats.com/blogs/";

            // Update to Laravel
            console.log(" Saving to Firebase via Laravel...");
            await axios.post(process.env.LARAVEL_API_URL, {
                title: article.title + " (AI Enhanced)",
                url: finalUrl, // Yahan hamne fix kiya
                content: newContent,
                source: "Groq AI Research"
            });

            console.log("✅ Successfully updated!");
            await new Promise(r => setTimeout(r, 2000));
        }
        console.log("\n All articles processed successfully!");
    } catch (err) {
        console.error(" Error:", err.message);
    }
}

startResearch();
