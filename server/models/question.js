const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({
    question: String,
    correctAnswer: String,
    incorrectAnswers: Array
});

module.exports = mongoose.model('Question', questionSchema);