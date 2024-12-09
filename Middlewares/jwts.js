const JWT_SECRET = process.env.JWT_SECRET;
const jwt = require('jsonwebtoken');

const myMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Private page requires login" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const data = jwt.verify(token, JWT_SECRET);
        console.log("in jwt",data)
        req.user = data.user;
        next();
    } catch (error) {
        res.status(403).json({ error: "Token is invalid or expired" });
    }
};

module.exports = myMiddleware;
