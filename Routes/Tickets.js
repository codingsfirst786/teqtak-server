const express = require('express')
const router = express.Router()
const {getAllTickets,getMyTickets,getEventTickets,createTicket,getATicket,ticketPostAndriod, getALLEventsTickets} = require('../Controller/Tickets')


//http://localhost:5000/tickets/all
//http://localhost:5000/tickets/all
router.get('/',getAllTickets)
router.get('/user/:id',getMyTickets)
router.get('/event/:id',getEventTickets)
router.get('/event',getALLEventsTickets)
router.get('/gen',createTicket)
router.get('/:id',getATicket)
router.post('/',ticketPostAndriod)



module.exports = router