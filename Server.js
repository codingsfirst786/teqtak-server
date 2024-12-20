require('dotenv').config()
const http = require('http');
const express = require("express")
const app = express()
const cors = require('cors')
const cookie = require("cookie-parser")
const bodyParser = require("body-parser")
const socketIo = require('socket.io');
const socketHandler = require('./Handlers/socketHandler');
const redirectUri = `${process.env.BACK_URL}/zoom/callback`;
const axios = require('axios');
const stripe = require("stripe")(process.env.STRIPE_SECRET);



// middlewares
// webhook usage
app.use('/payment/webhook', express.raw({ type: 'application/json' }));

// upload limit usage
const mbUploadLimit= '70mb'
app.use(express.json({ limit:mbUploadLimit }));
app.use(express.urlencoded({ limit:mbUploadLimit, extended: true }));
app.use(bodyParser.json({ limit:mbUploadLimit}));
app.use(bodyParser.urlencoded({ limit:mbUploadLimit, extended: true }));
 


const __CORS_ORIGINS__=[process.env.FRONT_URL,process.env.ADMIN_PANEL_URL,'http://localhost:5173','https://teqtak-admin-panel.vercel.app']

app.use(cors({
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  origin: __CORS_ORIGINS__,
  credentials: true 
})); 
app.use(cookie())
// middlewares end   


// sockets
const server = http.createServer(app);
const io = new socketIo.Server(server, {
  maxHttpBufferSize: 7e6, // 7 MB
  cors: {
    origin:  __CORS_ORIGINS__, 
  },
});
// sockets end


// routes
// OAuth @2.O
app.use('/', require('./Routes/GithubAuth'))
app.use('/', require('./Routes/FacebookAuth'))
app.use('/', require('./Routes/GoogleAuth'))



app.use('/cookies', require('./Routes/cookie-check'))
app.use('/users', require('./Routes/User'))
app.use('/jobs', require('./Routes/Job'))
app.use('/events', require('./Routes/Event'))
app.use('/podcasts', require('./Routes/Podcast'))
app.use('/admin', require('./Routes/Dashboard'))
app.use('/upload', require('./Routes/Videos'))
app.use('/payment', require('./Routes/Stripe'))
app.use('/comments', require('./Routes/Comments'))
app.use('/tickets', require('./Routes/Tickets'))
app.use('/meetings', require('./Routes/Meeting'))
app.use('/chatrooms', require('./Routes/ChatRoom'))
app.use('/notifications', require('./Routes/Notifications'))
app.use('/subscribe', require('./Routes/Subscribe'))
app.use('/reviews', require('./Routes/Reviews'))
app.use('/reply', require('./Routes/Reply'))
app.use('/views', require('./Routes/Views'))
app.use('/appliedjobs', require('./Routes/AppliedJobs'))
app.use('/reports', require('./Routes/Reports'))
app.use('/wishlist', require('./Routes/WishList'))
app.use('/block', require('./Routes/Blocked'))
app.use('/info', require('./Routes/EntType'))
app.use('/qna', require('./Routes/QueAns'))
app.use('/payreq', require('./Routes/PaymentRequest'))
// routes end



// Use the socket handler
socketHandler(io);

// for zoom code in frontend
app.get('/zoom/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const response = await axios.post('https://zoom.us/oauth/token', null, {
      params: {
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      },
      auth: {
        username: process.env.ZOOM_ID,
        password: process.env.ZOOM_SECRET,
      },
    });

    const { access_token } = response.data;
    res.redirect(`${process.env.FRONT_URL}/zoom?access_token=${encodeURIComponent(access_token)}`);
  } catch (error) {
    console.log({error})
    res.status(500).send(error);
  }
});
// for stripe




server.listen(process.env.PORT, () => { console.log(`listening to port ${process.env.PORT}`) })
