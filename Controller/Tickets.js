const Ticket = require('../Schemas/Ticket')
const Event = require('../Schemas/Events')
const User = require('../Schemas/User')
const jwt = require("jsonwebtoken")
const { Mail_Factroy } = require("../Mail/Mail_Factory")
const { v4: uuidv4 } = require('uuid');



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
        const ticket = await Ticket.scan('ticketEventId').eq(id).exec()
        res.json({
            count: ticket.length,
            data: ticket
        })

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

    res.json({...ticket,event,seller,buyer})

} catch (error) {
        console.log({error})
        res.send("error ",error)
}
}

const getAllData=async(ticket)=>{
    const data = await Promise.all(ticket.map(async(e,i)=>{
        try{
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
    catch(e){
        console.log({e})
        return null
    }

    }))
    const filtered = data.filter((e)=>e!=null)
    return filtered

}

const ticketPostAndriod = async(req,res)=>{
    try {
        console.log("posting through andriod")
        const _id = uuidv4()
        console.log("body is ",req.body.data)
        console.log("body is ", process.env.JWT_AND)
        const metadata = jwt.verify(req.body.data, process.env.JWT_AND)
        const ticket = new Ticket({ _id, ...metadata })
        await ticket.save()
        await Mail_Factroy(metadata.ticketBuyerId, "Ticket bought for an event", "Ticket bought for an event")
        // res.json(metadata)
        res.json(ticket)

    } catch (error) {
        console.log(error)
        res.send("error",error)

    }


}

module.exports = { getAllTickets, getMyTickets, getEventTickets, createTicket,getATicket,ticketPostAndriod }
