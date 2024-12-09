
const { v4: uuidv4 } = require('uuid');
const User = require('../Schemas/User')
const jwt = require('jsonwebtoken')

const Authentication_Factory = async (req, res) => {
    // res.send("req factory")
    try {

        // data collection
        const name = req.body.name ? req.body.name : ""
        const ghId = req.body.ghId ? req.body.ghId : ""
        const email = req.body.email ? req.body.email : ""
        const role = req.body.role ? req.body.role : ""
        const signedInBy = req.body.signedInBy ? req.body.signedInBy : ""
        const fbId = req.body.fbId ? req.body.fbId : ""
        const data = { name, ghId , email, role, signedInBy, fbId }
        console.log({data})

        // check user
        const user = await searcher(data)
        console.log({user})
        // signup

        if (user.length == 0) {
            const Users_PK = uuidv4()
            const UserCreation = new User({ Users_PK, ...data })
            const savedUser = await UserCreation.save()
            console.log({savedUser})
            const payload = {
                user: savedUser.Users_PK
            }
            const authtoken = jwt.sign(payload, process.env.JWT_SECRET);
            console.log({authtoken})
            res.json({ authtoken, user: savedUser })

        }
        else {
            const savedUser = await User.get(user[0])
            const payload = {
                user: savedUser.Users_PK
            }
            const authtoken = jwt.sign(payload, process.env.JWT_SECRET);
            res.json({ authtoken, user: savedUser })
        }

    } catch (error) {
        console.log({ error })
        res.send(error)
    }
}

const searcher = async (data) => {
    const signedInBy = data.signedInBy

    const dict = {
        "google": 'email',
        "github": 'ghId',
        "facebook": 'fbId',
    }
    const scan_= dict[signedInBy]
    const eq_= data[dict[signedInBy]]
    console.log({scan_,eq_,signedInBy})
    const user = await User.scan(dict[signedInBy]).eq(data[dict[signedInBy]]).exec()
    console.log({user})
    return user
} 

module.exports  = Authentication_Factory
