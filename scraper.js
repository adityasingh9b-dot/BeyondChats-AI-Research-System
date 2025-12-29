const axios = require('axios');
const cheerio = require('cheerio');
const admin = require('firebase-admin');

const serviceAccount = require("./serviceAccountKey.json");

if (!admin.apps.length)
{
    admin.initializeApp
    ({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://beyondchats-d8b88-default-rtdb.europe-west1.firebasedatabase.app"
    });
}

const db = admin.database();
const articlesRef = db.ref("articles");

async function getFullContent(link)
{
    
    try
    {
        const { data } = await axios.get(link, { timeout: 5000 });
        const $ = cheerio.load(data);
        
        // Multple selectors try kar rahe hain content ke liye
        let content = $('article').text() || $('.entry-content').text() || $('.post-content').text() || 'Content not found';
        return content.replace(/\s+/g, ' ').trim().substring(0, 1000); // Limit to 1000 chars for clean view
    }
    
    catch (error)
    {
        return "Fetch error";
    }
}

async function startScraping()
{
    const url = "https://beyondchats.com/blogs/"; // Main blog page try karte hain
    console.log("🚀 Scanning for 5 articles...");

    try
    {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);
        
        // Sabse common selector try kar rahe hain links ke liye
        const links = [];
        $('h2.entry-title a, h3.entry-title a, .post-title a').each((i, el) => {
            if (links.length < 5) {
                links.push({
                    title: $(el).text().trim(),
                    url: $(el).attr('href')
                });
            }
        });

        console.log(`✅ Found ${links.length} articles. Starting detailed scrape...`);

        for (const item of links) {
            console.log(`🔍 Scraping: ${item.title}`);
            const fullContent = await getFullContent(item.url);

            await articlesRef.push({
                title: item.title,
                url: item.url,
                content: fullContent,
                createdAt: Date.now()
            });
            console.log(`👍 Saved to Firebase!`);
        }

        console.log("\n🔥 ALL DONE! Check Firebase now.");
        process.exit(0);

    } catch (err) {
        console.error("❌ Error:", err.message);
        process.exit(1);
    }
}

startScraping();
