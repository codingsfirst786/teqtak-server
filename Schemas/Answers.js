const dynamoose = require('dynamoose');

const answerSchema = new dynamoose.Schema({
    _id:{
      type:String,
      hashKey:true
    },
    userId:String,
    questionId:String,
    answer:String,

    }, {
      timestamps: true
    });
const Answer = dynamoose.model('Answers',answerSchema);

module.exports = Answer;

  