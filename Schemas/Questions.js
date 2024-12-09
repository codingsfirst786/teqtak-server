const dynamoose = require('dynamoose');

const questionSchema = new dynamoose.Schema({
    _id:{
      type:String,
      hashKey:true
    },
    userRole:String,
    question:String,
    options:{
        type:Array,
        schema:[String],
    },

    }, {
      timestamps: true
    });
const Question = dynamoose.model('Questions',questionSchema);

module.exports = Question;

  