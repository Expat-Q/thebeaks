module.exports = (req, res) => {
    try {
        const { MongoClient } = require('mongodb');
        const pkg = require('mongodb/package.json');
        res.status(200).json({ 
            success: true, 
            mongoLoaded: true, 
            version: pkg.version,
            nodeVersion: process.version
        });
    } catch (e) {
        res.status(200).json({ 
            success: false, 
            error: e.message,
            code: e.code,
            nodeVersion: process.version
        });
    }
};
