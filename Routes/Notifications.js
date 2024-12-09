const express = require('express')
const router = express.Router()
const {Mail_Factroy} = require('../Mail/Mail_Factory')

const {deleteNotification,getAllNotifications,getMyNotifications} = require('../Controller/Notifications')


router.get('/',getAllNotifications)
router.get('/:id',getMyNotifications)
// router.get('/:id',viewVideo)
router.get('/test/:id',async(req,res)=>{
    console.log(`test ${req.params.id}`)
    // f7d8c39e-c5be-402c-a8fb-94e0190376ab
    console.log("in factory")
    await Mail_Factroy(req.params.id,"some title","some desc")
    console.log("out factory")
    res.send("ope ended")
})
router.delete('/:id',deleteNotification)

module.exports = router