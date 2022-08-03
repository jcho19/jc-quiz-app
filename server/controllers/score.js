const User = require('../models/user');
const jwt = require('jsonwebtoken');

const handleScore = async (req, res) => {
    // verify access token from request, and if the token is valid and the username  
    // from the access token is found in a user from db, determine if the user's high
    // score should be updated
    jwt.verify(req.headers['authorization'].split(' ')[1],
        process.env.ACCESS_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                return res.sendStatus(403);
            }
            username = decoded.username;
            const user = await User.findOne({ username }).exec();
            if (!user) {
                return res.sendStatus(403);
            }
            if (typeof user.highestScore === 'undefined' || user.highestScore < req.body.score ){
                user.highestScore = req.body.score;
                await user.save();
                res.status(200).json({'message': `Congrats ${user.username}, your new high score is ${user.highestScore}/12!`})
            }
            else {
                res.status(200).json({'message': `Hey ${user.username}, you got a ${req.body.score}/12. Your high score is still ${user.highestScore}/12.`})
            }
         });
}

module.exports = { handleScore }