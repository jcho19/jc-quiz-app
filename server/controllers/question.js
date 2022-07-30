const Question = require('../models/question');

const handleQuestion = async (req, res) => {
    const questions = await Question.aggregate([{ $sample: { size: 12 } }]);
    res.status(200).json(questions);
}

module.exports = { handleQuestion }