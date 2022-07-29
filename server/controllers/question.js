const Question = require('../models/user');

const handleQuestion = async (req, res) => {
    const questions = Question.aggregate([{ $sample: { size: 15 } }]);
    res.status(200).json(questions);

}

module.exports = { handleQuestion }