const Question = require('../models/question');

const handleQuestion = async (req, res) => {
    try {
        const questions = await Question.aggregate([{ $sample: { size: 12 } }]); // get 12 random questions from db
        res.status(200).json(questions);
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleQuestion }