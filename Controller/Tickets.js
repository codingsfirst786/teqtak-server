const Ticket = require('../Schemas/Ticket')
const Event = require('../Schemas/Events')
const User = require('../Schemas/User')
const jwt = require("jsonwebtoken")
const { Mail_Factroy } = require("../Mail/Mail_Factory")
const { v4: uuidv4 } = require('uuid');
const { Logger } = require('../Functions/Logger')
const { get } = require('../Mail/transport')



const getAllTickets = async (req, res) => {
    try {
        console.log("getting all")
        const ticket = await Ticket.scan().exec()
        const data = await getAllData(ticket)
        res.json({
            count: data.length,
            data: data
        })

    } catch (error) {
        console.log(error)
        res.send(error)

    }
}
const getMyTickets = async (req, res) => {
    try {
        const id = req.params.id
        const ticket = await Ticket.scan('ticketBuyerId').eq(id).exec()
        const data = await Promise.all(ticket.map(async (e) => {
            const event = await Event.get(e.ticketEventId)
            if (event) {
                return { ...e, event }
            }
            else {
                return { ...e, event: null }
            }


        }))
        res.json({
            count: data.length,
            data: data
        })

    } catch (error) {
        console.log(error)
        res.send(error)

    }

}
const getEventTickets = async (req, res) => {
    try {
        const id = req.params.id
        const event = await Event.get(id)
        const poster = await User.get(event.eventCreatedBy)
        // console.log({poster})    
        const ticket = await Ticket.scan('ticketEventId').eq(id).exec()
        let data = await Promise.all(ticket.map(async (e) => {
            try {
                const buyer = await User.get(e.ticketBuyerId)
                return { ...e, buyer }
            } catch (error) {
                return null
            }
        }))
        data = data.filter((e) => e != null)
        res.json({
            count: data.length,
            poster,
            event,
            data: data
        })

    } catch (error) {
        console.log(error)
        res.send(error)

    }

}

const getALLEventsTickets = async (req, res) => {
    try {

        let allEventIds = await Ticket.scan().attributes(['ticketEventId']).exec()
        allEventIds = allEventIds.map((e) => e.ticketEventId)

        const data = await TicketMapper(allEventIds)
        res.json(data)

    } catch (error) {
        console.log(error)
        res.send(error)

    }

}

const createTicket = async (req, res) => {
    try {
        const _id = uuidv4()
        console.log({ metadataToken: req.query.meta })
        const metadata = jwt.verify(req.query.meta, process.env.JWT_SECRET)
        console.log({ metadata: metadata.ticketBuyerId })
        const ticket = new Ticket({ _id, ...metadata })
        await ticket.save()
        await Mail_Factroy(metadata.ticketBuyerId, "Ticket bought for an event", "Ticket bought for an event")
        res.redirect(`${process.env.FRONT_URL}/ticketdetails?eventid=${metadata.ticketEventId}&buyerid=${metadata.ticketBuyerId}&ticketid=${_id}`)

    } catch (error) {
        console.log(error)

    }

}

const getATicket = async (req, res) => {
    try {

        const ticket = await Ticket.get(req.params.id)
        const event_ = await Event.get(ticket.ticketEventId)
        const buyer_ = await User.get(ticket.ticketBuyerId)
        const buyer = buyer_ || {}
        const event = event_ || {}
        const seller_ = await User.get(event.eventCreatedBy)
        const seller = seller_ || {}

        res.json({ ...ticket, event, seller, buyer })

    } catch (error) {
        console.log({ error })
        res.send("error ", error)
    }
}

const getAllData = async (ticket) => {
    const data = await Promise.all(ticket.map(async (e, i) => {
        try {
            const event_ = await Event.get(e.ticketEventId)
            const buyer_ = await User.get(e.ticketBuyerId)
            const buyer = buyer_ || {}
            const event = event_ || {}
            const seller_ = await User.get(event.eventCreatedBy)
            const seller = seller_ || {}
            return {
                ...e,
                buyer,
                event,
                seller
            }
        }
        catch (e) {
            console.log({ e })
            return null
        }

    }))
    const filtered = data.filter((e) => e != null)
    return filtered

}

const ticketPostAndriod = async (req, res) => {
    try {
        console.log("posting through andriod")
        const _id = uuidv4()
        console.log("body is ", req.body.data)
        console.log("body is ", process.env.JWT_AND)
        const metadata = jwt.verify(req.body.data, process.env.JWT_AND)
        const ticket = new Ticket({ _id, ...metadata })
        await ticket.save()
        await Mail_Factroy(metadata.ticketBuyerId, "Ticket bought for an event", "Ticket bought for an event")
        // res.json(metadata)
        res.json(ticket)

    } catch (error) {
        console.log(error)
        res.send("error", error)

    }


}



async function TicketMapper(eventArray) {

    let bigData = await Promise.all(eventArray.map(async (e,i) => {
        try{
        const event = await Event.get(e,{ attributes: ["_id", "eventTitle",'eventCreatedBy','createdAt'] })
        const poster = await User.get(event.eventCreatedBy,{ attributes: ["name", "email","Users_PK"] })
        const ticket = await Ticket.scan('ticketEventId').eq(e).attributes(['ticketBuyerId','totalAmount']).exec()
        let data = await Promise.all(ticket.map(async (e) => {
           
                const buyer = await User.get(e.ticketBuyerId, { attributes: ["name", "email","picUrl"] })
                return { ...e, buyer }
            } 
        ))
        return {
          data:{ count: data.length,
            poster,
            event,
            tickcets: data}
        }
    }
        catch(e){
            return null
        }

    }))
    bigData = bigData.filter((e)=>e!=null)
    console.log("big data has been fetch")
    return bigData

}

module.exports = { getAllTickets, getMyTickets, getEventTickets, createTicket, getATicket, ticketPostAndriod, getALLEventsTickets }
