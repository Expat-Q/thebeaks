const { MongoClient } = require('mongodb');

// Connection URI and Database Name
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

async function connectToDatabase() {
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
    }
    return client.db('beaks-puzzle-game');
}

export default async function handler(req, res) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection('leaderboard');

        if (req.method === 'GET') {
            // Fetch top 50 scores
            const scores = await collection
                .find({})
                .sort({ level_reached: -1, total_time: 1 })
                .limit(50)
                .toArray();

            return res.status(200).json(scores);

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
