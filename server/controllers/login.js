const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { username, password } = req.body;
    const user = await User.findOne({ username }).exec();
    if(!user) {
        return res.status(401).json({ 'message': 'Incorrect username or password.' });
    }
    const validPassword = await bcrypt.compare(password, user.password)
    if(!validPassword) {
        return res.status(401).json({ 'message': 'Incorrect username or password.' });
    }
    const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '30m' });
    const refreshToken = jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: 60000 * 60 * 24, secure: true, sameSite: 'None' });
    res.status(201).json( { accessToken } );
}

module.exports = { handleLogin };
