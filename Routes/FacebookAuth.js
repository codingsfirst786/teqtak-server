
const express = require("express");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const app = express.Router()
const { v4: uuidv4 } = require('uuid');
const User = require('../Schemas/User')
const jwt = require('jsonwebtoken')
const EntType = require('../Schemas/EntrepenureType')


passport.use(
  new FacebookStrategy({
    clientID: process.env.FACEBOOK_ID,
    clientSecret: process.env.FACEBOOK_SECRET,
    callbackURL: "https://api.teqtak.com/auth/facebook/callback",
    // profileFields: ["id", "displayName", "emails", "name"],
    // scope: ["profile", "email"]
  },

    async (accessToken, refreshToken, profile, done) => {
      console.log("facebook")
      console.log(profile)
      try {
        let user = profile
        const name = user.displayName
        const fbId = profile.id
        const role = 'viewer'
        const signedInBy = 'facebook'
        let Users_PK = uuidv4();
        let users = await User.scan()
          .where('signedInBy').eq('facebook')
          .where('fbId').eq(fbId)
          .exec()

        if (users.length > 0) {
          Users_PK = users[0].Users_PK
          user = Users_PK
          console.log("user already exists")
          //   console.log({Users_PK})
        }
        else {
          user = Users_PK
          const user_ = new User({
            Users_PK, name, fbId, role, signedInBy
          })
          await user_.save()
          const newEntType = new EntType({ _id: Users_PK, userId: Users_PK });
          const savedEntType = await newEntType.save();
          console.log("new user created")

        }

        return done(null, user)
      } catch (error) {
        return done(error, null)
      }
    }
  )
)

// initial github
app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email'] }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { session: false, failureRedirect: '/faliure' }),
  async (req, res) => {
    const data = await User.get(req.user)
    const _id = data.Users_PK
    const payload = {
      user: _id
    }
    const authtoken = jwt.sign(payload, process.env.JWT_SECRET);
    res.cookie('user', _id);
    res.cookie('jwt', authtoken, { httpOnly: true, secure: false })
    res.redirect(`${process.env.FRONT_URL}/bording?authtoken=${authtoken}&user=${_id}`)

  }
);

module.exports = app