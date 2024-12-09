const express = require('express')
const router = express.Router()
const {getAllTickets,getMyTickets,getEventTickets,createTicket,getATicket,ticketPostAndriod} = require('../Controller/Tickets')


//http://localhost:5000/tickets/all
//http://localhost:5000/tickets/all
router.get('/',getAllTickets)
router.get('/user/:id',getMyTickets)
router.get('/event/:id',getEventTickets)
router.get('/gen',createTicket)
router.get('/:id',getATicket)
router.post('/',ticketPostAndriod)



module.exports = router