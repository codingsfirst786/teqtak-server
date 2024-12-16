
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const OAuth2Strategy = require("passport-google-oauth2").Strategy;
const app = express.Router()
const { v4: uuidv4 } = require('uuid');
const client_ = require('../Middlewares/Client')
const User = require('../Schemas/User')
const EntType = require('../Schemas/EntrepenureType')
const jwt = require('jsonwebtoken');
const { Signup_Mail } = require("../Mail/event/signup");

passport.use(
  new OAuth2Strategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://api.teqtak.com/auth/google/callback",
    scope: ["profile", "email"]
  },

    async (accessToken, refreshToken, profile, done) => {
      try {
        let user
        console.log("google",{accessToken})
        console.log("google",{profile})
        const name = profile.name.givenName
        const email = profile.email
        const role = 'viewer'
        const signedInBy = 'google'
        let Users_PK = uuidv4();
        let users = await User.scan()
        .where('signedInBy').eq('google')
        .where('email').eq(email)
        .exec()
   
        if (users.length > 0) {
          Users_PK = users[0].Users_PK
          user=Users_PK
        }
        else {
          user=Users_PK
          const user_ = new User({
            Users_PK, name, email, role, signedInBy
          })
          await user_.save()
          await Signup_Mail(email)
          console.log("new user from gmail")

        }

        return done(null,user)
      } catch (error) {
        return done(error, null)
      }
    }
  )
)

// initial google ouath login
app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

app.get('/auth/google/callback',
  passport.authenticate('google', {session:false ,failureRedirect: `${process.env.FRONT_URL}/login` }),
  async (req, res) => {
    const data = await User.get(req.user)
    const _id = data.Users_PK
    const payload = {
      user: _id
    }
    const authtoken = jwt.sign(payload, process.env.JWT_SECRET);
    res.redirect(`${process.env.FRONT_URL}/bording?authtoken=${authtoken}&user=${_id}`)
  }
);



app.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err) }
    res.redirect(process.env.FRONT_URL);
  })
})


module.exports = app