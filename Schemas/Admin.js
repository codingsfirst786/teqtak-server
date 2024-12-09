const dynamoose = require('dynamoose');


const adminData = new dynamoose.Schema({
    _id: {
        type: String,
        hashKey: true
    },
    userName: String,
    email: String,
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    country: String,
    postalCode: String,
    aboutMe: String,
    picUrl:String,
    picName:String
}, {
    timestamps: true
});

const AdminData = dynamoose.model('AdminData', adminData);

module.exports = AdminData;
