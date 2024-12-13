/* {
@Route /meeting POST

 }*/


const transport = require("../transport")
const {meetingCreation} = require("../templates/MeetingCreation")


const meeting_Mail = async (email,title,agenda) => {
        try {
            const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: email,
            subject: "Meeting Alert",
            html: meetingCreation(title,agenda)
        };

        console.log("sending now");
        const info = await transport.sendMail(mailOptions);
        console.log(`Email sent:--> ${info.response}`)

    } catch (error) {
        console.log("error in mail_factory ", error)
    }
}

module.exports = { meeting_Mail }