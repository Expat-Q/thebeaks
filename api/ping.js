module.exports = (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        message: 'Function is running!',
        env_has_mongo: !!process.env.MONGODB_URI
    });
};
