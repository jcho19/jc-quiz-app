const User = require('../models/user');
const jwt = require('jsonwebtoken');

const handleRefresh = async (req, res) => {
    refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        return res.sendStatus(401);
    }
    const user = await User.findOne({ refreshToken }).exec();
    if(!user) {
        return res.sendStatus(403);
    }
    jwt.verify(refreshToken,
               process.env.REFRESH_TOKEN_SECRET,
               (err, decoded) => {
                    if (err || user.username !== decoded.username) {
                        return res.sendStatus(403);
                    }
                    const username = user.username;
                    const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
                    res.status(200).json({ accessToken });
                });
}

module.exports = { handleRefresh };