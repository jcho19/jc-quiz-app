const User = require('../models/user');

const handleRankings = async(req, res) => {
    try {
        const topUsers = await User.find().sort({ highestScore: -1 }).limit(5).exec(); // get the 5 users with the highest scores
        // remove unnecssary properties
        const revisedUsers = topUsers.map(user => ({ username: user.username, highestScore: user.highestScore }));
        res.status(200).json(revisedUsers);
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleRankings }