
const User = require("../Schemas/User");
const transport = require("./transport")
const {Starter} = require("./templates/starter")


const Simple_Mail_Factroy = async (email, subject_Title, desc) => {
        try {
            const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: email,
            subject: subject_Title,
            html: Starter("User",desc)
        };

        console.log("sending now");
        const info = await transport.sendMail(mailOptions);
        console.log(`Email sent:--> ${info.response}`)

    } catch (error) {
        console.log("error in mail_factory ", error)
    }
}

module.exports = { Simple_Mail_Factroy }