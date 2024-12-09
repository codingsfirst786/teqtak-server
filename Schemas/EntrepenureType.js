const dynamoose = require('dynamoose');


const entType = new dynamoose.Schema({
  _id: {
    type: String,
    hashKey: true,
  },
  userId: {
    type: String,
    required: true,
     
  },
  tech:String,
  bioTech:String,
  food:String,

  fashion:String,
  service:String,
  social:String,

  ecom:String,
  estate:String,
  edu:String,

  funds:String,
  exp:String,
  strategy:String,

  market:String,
  product:String,
  team:String,


}, {
  timestamps: true
});

// Create model
const EntType = dynamoose.model('Blocked', entType);

module.exports = EntType;
