const dynamoose = require('dynamoose');


const paymentSchema = new dynamoose.Schema({
    _id: {
        type: String,
        hashKey: true
    },
  userId:String,
  eventId:String,
  requestStatus:String,
  bankAccountId:String,
  stripeId:String,
  paypalId:String,
  phoneNumber:String,
  email:String,
  amount:String
}, {
    timestamps: true
});

const PaymentRequest = dynamoose.model('PaymentRequests', paymentSchema);

module.exports = PaymentRequest;
