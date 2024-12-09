const express = require('express')
const router = express.Router()
const {createView,deleteMyView,getItemViews,getSingleView,getAllViews,getUserWatchList} = require('../Controller/Views')

//http://localhost:5000/views/ 
router.get('/',getAllViews)
router.get('/:id',getUserWatchList)
router.post('/',createView)
router.delete('/:id',deleteMyView)



module.exports = router