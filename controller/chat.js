const {room,message} = require('../model/chat');

const test=(req, res)=>{
    console.log('request',req.body);
    res.send({message:'Test run successfully'});
  };

  const saveMessages = async(req,res)=>{
    const {name, createdBy} = req.body
    const post = new room({
          name,
          createdBy,
      })
      await post.save()
      res.send(post)
   
  };

 const getRooms = async(req,res)=>{
    const rooms = await room.find().sort({updatedAt:-1});
    res.send(rooms);
  };
  
  const unSetNewMsg = async(req,res)=>{
    const {name} = req.body;
    console.log('room',name);
    await room.updateOne({name:name},{$set:{isNewMsg:false}});
    res.send({message:'Room updated successfully'});
  };

  const getMessages = async(req,res)=>{
      const {room:roomName} = req.params;
      const data = await message.find({room:roomName}).sort({createdAt:1});
      res.send(data);
  }

  module.exports={
      test,
      saveMessages,
      getRooms,
      unSetNewMsg,
      getMessages
  }