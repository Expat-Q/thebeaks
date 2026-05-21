const { MongoClient } = require('mongodb');

let cachedClient = null;
let cachedDb = null;

async function connectToDatabase() {
    if (cachedClient && cachedDb) {
        return cachedDb;
    }

    const uri = process.env.MONGODB_URI;
    if (!uri) {
        throw new Error('MONGODB_URI is not defined in environment variables. Please check Vercel settings.');
    }

    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db('beaks-puzzle-game');

    cachedClient = client;
    cachedDb = db;
    return db;
}

export default async function handler(req, res) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('leaderboard');

        if (req.method === 'GET') {
            let username = null;
            if (req.query && req.query.username) {
                username = req.query.username;
            } else if (req.url) {
                const url = require('url');
                const queryObject = url.parse(req.url, true).query;
                username = queryObject.username;
            }

            if (username) {
                // Fetch progress for a specific user
                try {
                    const userDoc = await collection.findOne({ username: new RegExp('^' + username + '$', 'i') });
                    if (userDoc) {
                        return res.status(200).json(userDoc);
                    } else {
                        return res.status(200).json({ level_reached: 1, total_time: 0 }); // Default state
                    }
                } catch (e) {
                    console.error("FindOne Error:", e);
                    return res.status(500).json({ error: e.toString() });
                }
            } else {
                // Fetch top 50 scores
                const scores = await collection
                    .find({})
                    .sort({ level_reached: -1, total_time: 1 })
                    .limit(50)
                    .toArray();

                return res.status(200).json(scores);
            }

        } else if (req.method === 'POST') {
            // Upsert user score
            const { username, level_reached, total_time } = req.body;

            if (!username || typeof level_reached !== 'number' || typeof total_time !== 'number') {
                return res.status(400).json({ error: 'Invalid input data' });
            }

            // Check if user already exists
            const existingUser = await collection.findOne({ username });

            if (existingUser) {
                // Update only if they reached a higher level, OR if they are on the same level with a faster time
                if (
                    level_reached > existingUser.level_reached ||
                    (level_reached === existingUser.level_reached && total_time < existingUser.total_time)
                ) {
                    await collection.updateOne(
                        { username },
                        { $set: { level_reached, total_time, updated_at: new Date() } }
                    );
                    return res.status(200).json({ message: 'Score updated successfully' });
                } else {
                    return res.status(200).json({ message: 'Score not updated (previous score was better)' });
                }
            } else {
                // Insert new user score
                await collection.insertOne({
                    username,
                    level_reached,
                    total_time,
                    created_at: new Date(),
                    updated_at: new Date()
                });
                return res.status(201).json({ message: 'Score created successfully' });
            }
        } else {
            res.setHeader('Allow', ['GET', 'POST']);
            return res.status(405).end(`Method ${req.method} Not Allowed`);
        }
    } catch (error) {
        console.error('Database Error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
}
