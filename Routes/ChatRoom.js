const express = require('express');
const router = express.Router();
const {deleteChatRoom,getAllChatRooms,getMyChatRooms,createChatRoom,getARoom, deleteMessage} = require('../Controller/ChatRoom'); // Replace with your actual controller path


//http://localhost:5000/jobs/

router.post('/:id', createChatRoom);
router.get('/', getAllChatRooms);
router.get('/:id', getMyChatRooms);
router.get('/room/:id', getARoom);
router.post('/delete/:id', deleteChatRoom);
router.delete('/msg/:id', deleteMessage);


module.exports = router 