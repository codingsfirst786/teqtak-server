// socketHandler.js
const e = require('express');
const ChatRoom = require('../Schemas/ChatRoom');
const clientID = process.env.ZOOM_ID
const axios = require('axios');
const redirectUri = `${process.env.BACK_URL}/zoom/callback`;
const { v4: uuidv4 } = require('uuid');
const nf = require('../Functions/Notification_Factory');
const User = require('../Schemas/User');
const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3 = require('../Config/aws-s3')



const socketHandler = (io) => {
  try {
    io.on('connection', (socket) => {
      // console.log('A user connected:', socket.id);
      socket.on('joinRoom', async ({ roomId, userId }) => {
        socket.join(roomId);
        const chatRoom = await ChatRoom.get(roomId);
      
        if (chatRoom) {
          socket.emit('previousMessages', chatRoom.messages);
        }
        else {
          socket.emit('previousMessages', []);

        }
      });



      socket.on('sendMessage', async ({ roomId, sender, message }) => {
        const timestamp = new Date();
      
        let chatRoom = await ChatRoom.get(roomId);
        if (chatRoom.users.includes(sender)) {
          const messageId = uuidv4()
          io.to(roomId).emit('receiveMessage', { messageId, sender, message, timestamp });
          await ChatRoom.update(
            { _id: roomId },
            { $ADD: { messages: [{ messageId, sender, message, timestamp }] } }
          );
          // io.to(roomId).emit('previousMessages', chatRoom.messages);
          const user = chatRoom.users.filter((e) => e != sender)
          // const 
          const senderData = await User.get(sender)
          await nf(user[0], "received", `message from ${senderData.name}`, message)
          console.log('message was added')
        }

      });


  

      socket.on('sendMedia', async ({ roomId, sender, message }) => {

        console.log("sending media")
        const data = message
        const text = await saveToStorage(data.data, data.name, data.type, data.tag)

        const timestamp = new Date();
        let chatRoom = await ChatRoom.get(roomId);
        if (chatRoom.users.includes(sender)) {
          const messageId = uuidv4()
          io.to(roomId).emit('receiveMessage', { messageId, sender, message, timestamp });


          await ChatRoom.update(
            { _id: roomId },
            { $ADD: { messages: [{ messageId, sender, message: text, timestamp }] } }
          );
            const user = chatRoom.users.filter((e) => e != sender)
            const senderData = await User.get(sender)
            await nf(user[0], "received", `message from ${senderData.name}`, message)
            console.log('message was added')
          }

        });



      socket.on('zoomAuth', async ({ roomId }) => {
        try {
          console.log("zoomauth socket")
       
          const zoomAuthUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientID}&redirect_uri=${redirectUri}`;
          socket.emit('receiveAuthUrl', zoomAuthUrl);
         
          // socket.to(roomId).emit('receiveAuthUrl', zoomAuthUrl);
          // io.to(roomId).emit('receiveMessage', { sender, message, timestamp });
        } catch (error) {
          console.log({ error })
        }
      });



      socket.on('sendMeetingUrl', async (accessToken) => {
        // also will take room id
        console.log('sendMeetingUrl', accessToken)
        // console.log({roomId})
        try {


          const response = await axios.post('https://api.zoom.us/v2/users/me/meetings', {
            topic: "none",
            type: 2, // Scheduled meeting
            start_time: Date.now(),
            duration: 45,
          }, {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
          });
          let data = { sender: response.data.start_url, joiner: response.data.join_url }
          // await messageGenerator()
          socket.emit('receive_url', data)

          // may be we can aslo emit meetting url
        } catch (error) {
          console.log({ keys: Object.keys(error) })
          console.log({ error: error.message })
        }


      });



      socket.on('deleteMessage', async ({ roomId, sender, messageId }) => {
        let chatRoom = await ChatRoom.get(roomId);
        if (chatRoom) {
          const updatedMessages = chatRoom.messages.filter(
            (msg) => msg.messageId !== messageId
          );
          await ChatRoom.update(
            { _id: roomId },
            { $SET: { messages: updatedMessages } }
          );
          const chatRoom_ = await ChatRoom.get(roomId);
          console.log('Message deleted successfully');
          socket.emit('previousMessages', chatRoom_.messages);
        } else {
          console.log('Chat room does not exist');
        }
      })



      socket.on('disconnect', () => {
        // console.log('A user disconnected:', socket.id);
      });
    });
  }
  catch (error) {
    console.log(error)
  }
}


const messageGenerator = async (roomId, sender, message) => {
  const timestamp = new Date();
  let chatRoom = await ChatRoom.get(roomId);
  if (chatRoom.users.includes(sender)) {
    const messageId = uuidv4()
    io.to(roomId).emit('receiveMessage', { messageId, sender, message, timestamp });
    await ChatRoom.update(
      { _id: roomId },
      { $ADD: { messages: [{ messageId, sender, message, timestamp }] } }
    );
    const user = chatRoom.users.filter((e) => e != sender)
    console.log('Meeting was added')
  }
}

const saveToStorage = async (buff, name, type, tag) => {
  try {
    /* 
@params buffer
@params name of file 
@params mime-type
@params tag


@return string
    */
    const buffer = Buffer.from(buff)
    const Object_Name = uuidv4() + name

    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: Object_Name,
      Body: buffer,
      ContentType: type,
    };
    const command = new PutObjectCommand(params);
    const response = await s3.send(command);
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${Object_Name}`;
    const payload = JSON.stringify({ fileUrl, fileName: Object_Name })

    console.log({ response: `<${tag}>=${payload}` })

    return `<${tag}>=${payload}`

  } catch (error) {
    console.error('Error uploading file:', error);
  }
}


module.exports = socketHandler;






// const response = await axios.post(
//   'https://api.zoom.us/v2/users/me/meetings',
//   {
//     topic: "Team Sync", // Meeting title
//     type: 2, // Scheduled meeting
//     start_time: "2024-11-21T10:00:00Z", // ISO 8601 format (UTC)
//     duration: 45, // Duration in minutes
//     timezone: "America/New_York", // Meeting timezone
//     agenda: "Weekly team updates and discussion", // Meeting agenda
//     settings: {
//       host_video: true, // Enable host video
//       participant_video: true, // Enable participant video
//       join_before_host: false, // Prevent participants from joining before host
//       mute_upon_entry: true, // Mute participants on entry
//       approval_type: 2, // No registration required
//       waiting_room: true, // Enable waiting room
//       breakout_room: {
//         enable: true, // Enable breakout rooms
//         rooms: [
//           { name: "Team A", participants: ["user1@example.com"] },
//           { name: "Team B", participants: ["user2@example.com"] },
//         ],
//       },
//     },
//   },
//   {
//     headers: {
//       Authorization: `Bearer ${accessToken}`,
//       'Content-Type': 'application/json',
//     },
//   }
// );
