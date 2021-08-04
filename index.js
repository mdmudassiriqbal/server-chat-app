const express = require('express');
const socket = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const {url} = require('./config/');
const {room,message} = require('./model/chat');

mongoose.Promise = global.Promise;
mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
 console.log("Successfully connected to the database");    
}).catch(err => {
 console.log('Could not connect to the database. Exiting now...', err);
 process.exit();
});
const {join_User, get_Current_User, user_Disconnect,} = require('./user');


const app = express();
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json())
const port = 8000;
app.use(cors());
app.use('/',require('./route/'));
const server = app.listen(port, console.log(`Server is running on the port ${port}`));

const io = socket(server);
io.on('connection',(socket)=>{
  // socket.on('channels',()=>{
  //   const rooms = await room.find();
  // })
    socket.on('joinRoom', ({username, roomname})=>{
      console.log(socket.id)
        const p_user = join_User(socket.id, username, roomname);
        console.log('User joined room:',username);
        socket.join(p_user.room);
    });
    socket.on("chat", async(data) => {
      const chatMessage = new message(data);
      await room.updateOne({name:data.room},{$set:{isNewMsg:true}});
      chatMessage.save();
      socket.to(data.room).emit("message", data.content);
      });

      socket.on("disconnect", () => {
        const p_user = user_Disconnect(socket.id);
        if (p_user) {
          socket.to(p_user.room).emit("message", {
            userId: p_user.id,
            username: p_user.username,
            message: `${p_user.username} has left the chat`,
          });
        }
      });
});
