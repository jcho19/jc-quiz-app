const User = require('../models/user');

const handleRankings = async(req, res) => {
    try {
        let topUsers = await User.find().sort({ highestScore: -1}).limit(5).exec(); // get the 5 users with the highest scores
        // remove unnecssary properties
        modifiedUsers = topUsers.map((user) => {
            delete user['refreshToken'];
            delete user['password'];
        })
        res.status(200).json(modifiedUsers);
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleRankings }