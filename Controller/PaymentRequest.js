const { Logger } = require("../Functions/Logger")
const PaymentRequest = require("../Schemas/PaymentRequest")
const Event = require("../Schemas/Events")
const User = require("../Schemas/User")
const Ticket = require("../Schemas/Ticket")
const { v4: uuidv4 } = require('uuid');

const create=async(req,res)=>{
    try {



        const checkPayReq = await PaymentRequest.scan('eventId').eq(req.body.eventId).exec()
        if(checkPayReq && checkPayReq.length>0) return res.json({message:"error",info:"Already exists"})
       
       
        // check 
        const event = await Event.get(req.body.eventId)
        const user = await User.get(req.body.userId)
        if(user == null || user == undefined ) return res.json({message:"error",info:"provide valid data"})
        if(event == null || event == undefined ) return res.json({message:"error",info:"provide valid data"})

        // data cleaning
        const UnSafe_Data = {...req.body,amount:""}
        const {amount,...data} = UnSafe_Data

        // calculate amount
        const paymentAmount = await eventRevenue(req.body.eventId)
        const payReq = new PaymentRequest({
            _id:uuidv4(),
            ...data,
            requestStatus:"pending",
            amount:paymentAmount
        }) 
        await payReq.save()
        res.json(payReq)
        Logger('success',req.method+req.originalUrl)
        // creation
        
    } catch (error) {
        Logger('ERROR',req.url,error)
        res.send(error)
    }
}
const getOne=async(req,res)=>{
    try {
        // let data = await PaymentRequest.scan().exec()
        let data = await PaymentRequest.scan('userId').eq(req.params.id).exec()
        console.log({data})
        data = await Promise.all(data.map(async(e)=>{
            try {
                const event = await Event.get(e.eventId) 
                const user = await User.get(e.userId)
                return {...e,event,user}
            } catch (error) {
                return null
            }
        }))
        
        res.json({count:data.length,data})
        Logger('success',req.method+req.originalUrl)
    } catch (error) {
        Logger('ERROR',req.url,error)
        res.send(error)
    }
}
const getAll=async(req,res)=>{
    try {
        let data = await PaymentRequest.scan().exec()
        data = await Promise.all(data.map(async(e)=>{
            try {
                const event = await Event.get(e.eventId) 
                const user = await User.get(e.userId)
                return {...e,event,user}
            } catch (error) {
                return null
            }
        }))
        
        res.json({count:data.length,data})
        Logger('success',req.method+req.originalUrl)
    } catch (error) {
        Logger('ERROR',req.url,error)
        res.send(error)
    }
}
const remove=async(req,res)=>{
    try {
        await PaymentRequest.delete(req.params.id);
        res.json({ message: 'Payment Request deleted successfully' });
        Logger('success',req.method+req.originalUrl)
        
    } catch (error) {
        Logger('ERROR',req.url,error)
        res.send(error)
    }
}
const update=async(req,res)=>{
    try {
        const UnsafeData = {...req.body,amount:undefined}
        const {amount,...updateData} = UnsafeData
        console.log({updateData:req.body,id:req.params.id})
        const data = await PaymentRequest.update({ _id: req.params.id }, updateData);
        console.log({ "message": "success", data })
        res.json(data);
        Logger('success',req.method+req.originalUrl)
    } catch (error) {
        Logger('ERROR',req.url,error)
        res.send(error)
    }
}




const eventRevenue =async(eventId)=>{
    let tickets =  await Ticket.scan('ticketEventId').eq(eventId).attributes(['totalAmount']).exec()
    tickets = tickets.map((e)=>e.totalAmount)
    const amount = parseInt(( tickets.reduce((acc, num) => acc + num, 0) * .8))
    return amount.toString()
}
module.exports = {create,getAll,getOne,remove,update}