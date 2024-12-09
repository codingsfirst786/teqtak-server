const express = require('express')
const router = express.Router()
const {getAllUsers} = require('../Controller/User')
const {getInvesters, get_Users,getEntreperneurs,getBLockedUsers,getUsersByDate,getViewersByDate,getInvestersByDate,getEntByDate,getTicketsByDate, getJobs, getEvents, getPodcasts,getVideos}= require('../Controller/Dashboard')
const {getAllNotifications} = require('../Controller/Notifications')
const { makeSubAdmin, getAllSubAdmins, AdminLogin, subAdminLogin, __login__, deleteSubAdmin, Update_Admin_Info, Get_Admin_Info } = require('../Controller/SubAdmin')

const { Delete_Table } = require("../Controller/Delete_Table")



//http://localhost:5000/admin/allusers
router.get('/allusers',getAllUsers)
//http://localhost:5000/admin/investers
router.get('/investors',getInvesters)
//http://localhost:5000/admin/users
router.get('/users',get_Users)
//http://localhost:5000/admin/entrepreneur
router.get('/entrepreneur',getEntreperneurs)
//http://localhost:5000/admin/notifications
router.get('/not',getAllNotifications)
//http://localhost:5000/admin/blocked
router.get('/blocked',getBLockedUsers)
// router.get('/cr',getAllChatRooms)   

// analytics
router.get('/info/users',getUsersByDate)
router.get('/info/viewers',getViewersByDate)
router.get('/info/investors',getInvestersByDate)
router.get('/info/entrepreneur',getEntByDate)
router.get('/info/tickets',getTicketsByDate)
// router.get('/info/tickets',getUsersByDate)

router.get('/info/jobs',getJobs)
router.get('/info/events',getEvents)
router.get('/info/podcasts',getPodcasts)
router.get('/info/videos',getVideos)


// subadmins
router.get('/subadmin',getAllSubAdmins)
router.post('/subadmin',makeSubAdmin)
router.post('/profile/update',Update_Admin_Info)
router.get('/profile',Get_Admin_Info)
// router.get('/subadmin/:id',makeSubAdmin)
router.delete('/subadmin/:id',deleteSubAdmin)



// --> login etc

// router.post('/subadmin/login',subAdminLogin)
router.post('/login',__login__)


// table delete
// router.get('/deletetable',Delete_Table)


module.exports = router