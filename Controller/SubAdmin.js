const SubAdmin = require("../Schemas/SubAdmin")
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const User = require("../Schemas/User");
const { Simple_Mail_Factroy } = require("../Mail/Simple_Mail_Factory");
const AdminData = require("../Schemas/Admin");
const {Logger} = require('../Functions/Logger')


const makeSubAdmin__Legacy = async (req, res) => {
    try {
        // to-do email end thorugh getting email to send password....
        // get email if not send error
        // send password
        // create subadmin
        // send email
        // send response
        console.log("subadmin making")
        const userId = req.body.userId
        console.log({ userId })
        const user = await User.get(userId)
        console.log("making subadmin", user)
        if (user.email) {
            const password = uuidv4()
            const _id = uuidv4()
            const subadmin = new SubAdmin({ _id, userId, password, email: user.email })
            const savedSubAdmin = await subadmin.save()
            await Mail_Factroy(userId, "Admin panel access", `Your Admin-Panel Password is ${password}`)
            return res.json(savedSubAdmin)

        }
        return res.json({ message: "Not Feasible, Either User does not an email or User does not exist " })

    } catch (error) {
        console.log(error)
        res.send(error)
    }
}

const makeSubAdmin = async (req, res) => {
    try {
        console.log("subadmin making")
        // data null check
        if(req.body.email == undefined || req.body.password == undefined) return res.json({message:"Data insufficeint"})
        const email = req.body.email
        const password = req.body.password

        // already exist check
        const users = await SubAdmin.scan('email').eq(email).exec()
        if(users.length!=0)  return res.json({message:"Sub-Admin already exists"})
        
        const _id = uuidv4()
        const subadmin = new SubAdmin({ _id, email, password })
        const savedSubAdmin = await subadmin.save()

        // Mail to do
        await Simple_Mail_Factroy(email, "Admin panel access", `Your Admin-Panel Password is ${password}`)
        return res.json(savedSubAdmin)

    }
    catch (error) {
        console.log(error)
        res.send(error)
    }
}


const subAdminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;


        const userResults = await User.scan('email').eq(email).exec();
        if (!userResults || userResults.length === 0) {
            return res.status(400).json({ message: "User not found" });
        }

        const user = userResults[0];
        const data = await User.get(user.Users_PK);

        const subAdminDataArr = await SubAdmin.scan('userId').eq(user.Users_PK).exec()
        const subAdminData = subAdminDataArr[0]


        // Verify that the user signed in with email and that the password is correct
        if (data.password === subAdminData.password) {
            const payload = { user: data.Users_PK };
            const authtoken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
            res.json({ authtoken, user: { ...data, password: undefined } });


        } else if (data.password !== password) {
            // Handle incorrect password
            console.log("wrong password")

            return res.status(401).json({ message: "Wrong password" });
        } else {
            console.log("error")
            res.status(400).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        console.error("Error during local login:", error);
        res.status(500).json({ message: "Server error" });
    }
}

const AdminLogin = async (req, res) => {
    try {
        console.log("admin login")
        const { email, password } = req.body
        const emailSec = process.env.PANEL_EMAIL
        const passwordSec = process.env.PANEL_PASS
        if (email === emailSec && password === passwordSec) {
            const payload = { user: email, role: "admin" };
            const authtoken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
            return res.json({ authtoken, message: "success" });
        }
        return res.json({ message: "failed" })
    } catch (error) {
        console.log({ error })
        res.send(error)
    }
}

const getAllSubAdmins = async (req, res) => {
    try {
        console.log("sending")
        const data = await SubAdmin.scan().exec()
        res.json(data)

    } catch (error) {
        console.log({ error })
        res.send(error)
    }
}

const deleteSubAdmin = async (req, res) => {
    try {
        await SubAdmin.delete(req.params.id)
        res.json({ "message": "Deleted Successfully" })
    } catch (error) {
        console.log({ error })
        res.send(error)
    }
}

const __login__ = async (req, res) => {
    try {
        const { email, password } = req.body
        // admin login procedure
        if (email === process.env.PANEL_EMAIL && password === process.env.PANEL_PASS) {
            console.log("admin login")
            const payload = { user: email, role: "admin" };
            const authtoken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
            return res.json({ authtoken, message: "success" });
        }
        // admin login procedure end

        console.log("subadmin login")
        const suadmin = await SubAdmin.scan()
            .where('email').eq(email)
            .exec()

        if (suadmin.length == 0) return res.json({ message: "error", verbose: "No Such Sub-Admin exist" })

        const user = suadmin[0]
        if (user.password == password) {
            const payload = { user: email, role: "subAdmin", userId: user.Users_PK };
            const authtoken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' });
            return res.json({ authtoken, message: "success", role: "sub-admin" });
        }

        return res.json({ message: "error", verbose: "Invalid credentials" })
    } catch (error) {
        console.log({ error })
        res.send(error)

    }
}

const Update_Admin_Info=async(req,res)=>{
 try {
    const _id = 'admin-profile-data'
    const admin = await AdminData.update({ _id },req.body);
    res.json(admin)
 } catch (error) {

    console.log({error})
    res.json({message:error})
 }
   
}


const Get_Admin_Info=async(req,res)=>{
    try {
       const _id = 'admin-profile-data'
       const admin = await AdminData.get(_id);
       res.json(admin)
    } catch (error) {
   
       console.log({error})
       res.json({message:error})
    }
      
   }

module.exports = { AdminLogin, makeSubAdmin, AdminLogin, getAllSubAdmins, subAdminLogin, __login__, deleteSubAdmin ,Update_Admin_Info,Get_Admin_Info}