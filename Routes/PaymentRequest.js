const express = require('express')
const router = express.Router()
const {create,getAll,getOne,remove,update} = require('../Controller/PaymentRequest')

const jwtCheck = require("../Middlewares/jwts")


router.post('/',create)
router.get('/:id',getOne)
router.get('/',getAll)
router.put('/:id',update)
router.delete('/:id',remove)

module.exports = router