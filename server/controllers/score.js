const User = require('../models/user');
const jwt = require('jsonwebtoken');

// verify access token, and if the token is valid and the username  
// from the access token exists in the db, determine if user's highest
// score should be updated.
const handleScore = async (req, res) => {
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
            console.log(user);
            if (typeof user.highestScore === 'undefined' || user.highestScore < req.body.score ){
                user.highestScore = req.body.score;
                await user.save();
                res.status(200).json({'message': `Congrats ${user.username}! Your new high score is ${user.highestScore}/12!`})

            }
            else {
                res.status(200).json({'message': `Hey ${user.username}, you got a ${req.body.score}. Your high score is still ${user.highestScore}/12.`})
            }
         });
}

module.exports = { handleScore }