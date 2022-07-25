const User = require('../models/user');
const bcrypt = require('bcrypt');

const handleSignup = async(req, res) => {
    const { username, password } = req.body;
    const saltRounds = 10;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        await User.create({ 'username': username, 'password': hashedPassword });
        res.status(201).json({ 'message': `User ${username} has been succesfully created.` });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ 'message': 'Username is already taken.' });
        }
        
        res.status(500).json({ 'message': err.message });
        
    }

}

module.exports = { handleSignup };