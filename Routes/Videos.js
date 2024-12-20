const express = require('express')
const router = express.Router()
const upload = require('../Functions/Upload')
const { uploadVideo,getMyFeed,getUserVideos,getAllVideos,getVideo,deleteVideo,__init__} = require('../Controller/Video')
const isNotUser = require('../Middlewares/videoCheck')


router.post('/:id',upload.single('video'),uploadVideo)
router.get('/:id',getVideo)
router.get('/',__init__)
router.get('/user/:id',getUserVideos)
router.get('/user/feed/:id',getMyFeed)
router.get('/videos/all',getAllVideos)
router.post('/delete/:id',deleteVideo)

module.exports = router