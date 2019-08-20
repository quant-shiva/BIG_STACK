const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const QuestionSchema = new Schema({
  askby: {
    type: Schema.Types.ObjectId,
    ref: "myPerson"
  },
  tittle: {
    type: String,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  code: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  },
  answers: [
    {
      answerby: {
        type: Schema.Types.ObjectId,
        ref: "myPerson"
      },
      answer: {
        type: String,
        required: true
      },
      date: {
        type: Date,
        default: Date.now
      },
      upvotes: [
        {
          user: {
            type: Schema.Types.ObjectId,
            ref: "myPerson"
          }
        }
      ]
    }
  ]
});

module.exports = Question = mongoose.model("myquestion", QuestionSchema);
