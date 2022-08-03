const User = require('../models/user');

// if the refresh token from request is found in a user from db,
// erase the user's refresh token and clear the refreshToken cookie
const handleLogout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken
    if(!refreshToken) {
        return res.sendStatus(204);
    }
    const user = await User.findOne({ refreshToken }).exec();
    if (user) {
        user.refreshToken = '';
        await user.save();

    }
    res.clearCookie('refreshToken', {httpOnly: true, secure: true, sameSite: 'None' });
    res.sendStatus(204);

}
module.exports = { handleLogout };