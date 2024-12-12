
const User = require("../Schemas/User");
const transport = require("./transport")
const { Starter } = require("./templates/starter");
const { appliedToAJob } = require("./templates/AppliedToAJob");


const Applied_Job_Factory = async (email, username, resumeUrl, jobId) => {
    try {
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: email,
            subject: "Applied on a Job",
            html: appliedToAJob(username, resumeUrl, jobId)
        };

        console.log("sending now");
        const info = await transport.sendMail(mailOptions);
        console.log(`Email sent:--> ${info.response}`)

    } catch (error) {
        console.log("error in mail_factory ", error)
    }
}

module.exports = { Applied_Job_Factory }