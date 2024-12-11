
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GitHubStrategy = require('passport-github2').Strategy;
const app = express.Router()
const { v4: uuidv4 } = require('uuid');
const client_ = require('../Middlewares/Client')
const User = require('../Schemas/User')
const jwt = require('jsonwebtoken')
const EntType = require('../Schemas/EntrepenureType')

async function find_(params) {
  let scan = await User.scan();
  scan = await scan.where('email').contains(params);
  const result = await scan.exec();
  return { count: result.length, data: result };
}


passport.use(
  new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: `${process.env.BACK_URL}/auth/github/callback`,
    // scope: ["profile", "email"]
  },

    async (accessToken, refreshToken, profile, done) => { 
      console.log("github",profile)
      try {
        let user=profile
        const name =  user.displayName?user.displayName:profile.username 
        const ghId = profile.id
        const role = 'viewer'
        const signedInBy = 'github'
        let Users_PK = uuidv4();
        let users = await User.scan()
        .where('signedInBy').eq('github')
        .where('ghId').eq(ghId)
        .exec()
   
        if (users.length > 0) {
          Users_PK = users[0].Users_PK
          user=Users_PK
          console.log("user already exists")
        }
        else {
          user=Users_PK
          const user_ = new User({
            Users_PK, name, ghId, role ,signedInBy
          })
          await user_.save()
          const newEntType = new EntType({_id:Users_PK,userId:Users_PK});
          const savedEntType = await newEntType.save();
          console.log("new user created",user)
        }

        return done(null,user)
      } catch (error) {
        return done(error, null)
      }
    }
  )
)

// initial github
app.get('/auth/github', passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback', 
    passport.authenticate('github', {session:false, failureRedirect: '/faliure' }),
    async  (req, res) => {
    const data = await User.get(req.user)
    console.log({user:data})
    const _id = data.Users_PK
    const payload = {
      user: _id
    }
    const authtoken = jwt.sign(payload, process.env.JWT_SECRET);
    // res.cookie('user',_id);
    // res.cookie('jwt', authtoken, { httpOnly: true, secure: false })
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