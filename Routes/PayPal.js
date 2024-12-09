const express = require('express')
const router = express.Router()
const {paymentByPayPal,paypalSuccess} = require('../Controller/Payments/PayPal')


//http://localhost:5000/payments/stripe
router.post('/paypal',paymentByPayPal)
router.get('/paypal/success',paypalSuccess)

module.exports = router 
