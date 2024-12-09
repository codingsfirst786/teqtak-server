const User = require('../Schemas/User')
const isAdmin = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Private page requires login" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const data = jwt.verify(token, JWT_SECRET);
        // let result = await User.get(string)
        if (data.role === 'admin') {
            console.log("it is an admin indeed")
            next()
        }
        else {
            console.log("sorry bro not a admin")
            res.json({ "error": "not authorized" })
        }

    }
    catch {
        res.json({ "message": "not authneticated" })

    }

}

module.exports = isAdmin