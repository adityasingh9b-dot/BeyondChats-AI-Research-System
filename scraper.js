const axios = require('axios');
const cheerio = require('cheerio');
const admin = require('firebase-admin');

const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://beyondchats-d8b88-default-rtdb.europe-west1.firebasedatabase.app"
    });
}

const db = admin.database();
const articlesRef = db.ref("articles");

async function getFullContent(link) { //await
    try {
        const { data } = await axios.get(link, { timeout: 5000 });
        const $ = cheerio.load(data);
        let content = $('article').text() || $('.entry-content').text() || $('.post-content').text() || 'Content not found';
        return content.replace(/\s+/g, ' ').trim().substring(0, 1000);
    } catch (error) {
        return "Fetch error";
    }
}

// Helper function: Kisi bhi page se links nikalne ke liye
async function getLinksFromPage(pageNumber) {
    const url = `https://beyondchats.com/blogs/page/${pageNumber}/`;
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        const links = [];
        $('h2.entry-title a, h3.entry-title a, .post-title a').each((i, el) => {
            links.push({
                title: $(el).text().trim(),
                url: $(el).attr('href')
            });
        });
        return links.reverse(); // Reverse taaki sabse purana pehle aaye
    } catch (e) {
        console.log(`Page ${pageNumber} not found or error.`);
        return [];
    }
}

async function startScraping() {
    console.log("🚀 Starting Multi-Page Scraping for 5 oldest articles...");
    
    let linksToScrape = [];

    try {
        // 1. Sabse pehle Page 15 (Sabse purana) check karo
        console.log("Checking Page 15...");
        const page15Links = await getLinksFromPage(15);
        linksToScrape = [...page15Links];

        // 2. Agar 5 se kam hain, toh Page 14 par jao
        if (linksToScrape.length < 5) {
            console.log(`Page 15 only had ${linksToScrape.length} articles. Checking Page 14...`);
            const page14Links = await getLinksFromPage(14);
            
            // Jitne bache hain (5 - current length), utne Page 14 se le lo
            const remainingNeeded = 5 - linksToScrape.length;
            linksToScrape = [...linksToScrape, ...page14Links.slice(0, remainingNeeded)];
        }

        console.log(`Total found for scraping: ${linksToScrape.length}`);

        // 3. Final Scraping Loop
        for (const item of linksToScrape) {
            console.log(` Scraping: ${item.title}`);
            const fullContent = await getFullContent(item.url);

            await articlesRef.push({
                title: item.title,
                url: item.url,
                content: fullContent,
                createdAt: Date.now()
            });
            console.log(` ✅ Saved to Firebase!`);
        }

        console.log("\n ALL DONE! Target achieved.");
        process.exit(0);

    } catch (err) {
        console.error(" Error:", err.message);
        process.exit(1);
    }
}

startScraping();
