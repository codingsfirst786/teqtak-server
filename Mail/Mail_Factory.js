
const User = require("../Schemas/User");
const transport = require("./transport")
const {Starter} = require("./templates/starter")

const getUserEmail=async(id)=>{
    const user = await User.get(id)
    if(user && user.email){
        return {email:user.email,name:user.name}
    }
    else{
        return false
    }
}


const Mail_Factroy = async (id, subject_Title, desc) => {
    const data = await getUserEmail(id)
    if(data){
        try {
            const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: data.email,
            subject: subject_Title,
            html: Starter(data.name,desc)
        };

        console.log("sending now");
        const info = await transport.sendMail(mailOptions);
        console.log(`Email sent:--> ${info.response}`)

    } catch (error) {
        console.log("error in mail_factory ", error)
    }
}
else{
    console.log("not sending mail cause no data was provided")
}
}

// console.log("start")
// Mail_Factroy("44","#%","$%","5454")
// console.log("end")
module.exports = { Mail_Factroy }
// f7d8c39e-c5be-402c-a8fb-94e0190376ab