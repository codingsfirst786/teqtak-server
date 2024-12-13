/* {
@Route /auth/login
@Route /auth/google/callback
 }*/


const transport = require("../transport")
const {signup} = require("../templates/signup")


const Signup_Mail = async (email) => {
        try {
            const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: email,
            subject: "Welcome to Teqtak RIE",
            html: signup
        };

        console.log("sending now");
        const info = await transport.sendMail(mailOptions);
        console.log(`Email sent:--> ${info.response}`)

    } catch (error) {
        console.log("error in mail_factory ", error)
    }
}

module.exports = { Signup_Mail }