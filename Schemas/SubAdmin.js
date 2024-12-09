const dynamoose = require('dynamoose');

const subAdminSchema = new dynamoose.Schema({
    _id: {
        type: String,
        hashKey: true
    },
    userId: String,
    email: String,
    password: String,
    adminData:String,
    role: {
        type: String,
        default: "subAdmin"
    }
}, { timestamps: true });

const SubAdmin = dynamoose.model('SubAdmin', subAdminSchema);

module.exports = SubAdmin;
