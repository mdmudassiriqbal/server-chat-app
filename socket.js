const User = require("./model/user");
const Channel = require("./model/channel");
const Message = require("./model/message");
const events = {
  join: "join",
  leave: "leave",
  msgSend: "msgSend",
  msgReceive: "msgReceive",
  connect: "connect",
  disconnect: "disconnect",
  online: "online",
  offline: "offline",
  error: "error",
  roomJoined: "roomJoined",
};

const joinSavedChannels = async (socket, data) => {
  const userData = await User.findOne({ username: data.username });
  console.log("userData", userData);
  userData.channels.forEach((channel) => socket.join(channel));
  return userData.channels;
};

const handleJoin =
  (socket) =>
  async ({ channelToJoin, username, prevChannel }) => {
    if (!channelToJoin) {
      console.log("error joining channel: no channel specified");
      return;
    }
    channelToJoin = channelToJoin.toLowerCase();
    if (prevChannel) {
      socket.leave(prevChannel.toLowerCase());
    }
    socket.join(channelToJoin);
    console.log(`${username} joined ${channelToJoin}`, socket.rooms);
  };

const handleMsg = (socket) => (data) => {
  data.room = data.room.toLowerCase();
  if (!data.room) {
    console.log("error sending message: no channel selected");
    return;
  }

  if (!socket.rooms.has(data.room)) {
    console.log("error sending message: not joined to channel");
    return;
  }

  if (!data.msg) {
    console.log("error sending message: no message specified");
    return;
  }

  const msgData = {
    date: Date.now(),
    room: data.room,
    user: data.user,
    msg: data.msg,
  };

  socket.to(data.room).emit(events.msgReceive, msgData);

  const newMessage = new Message();

  newMessage.user = data.user;
  newMessage.text = data.msg;
  newMessage.channel = data.room.toLowerCase();

  newMessage
    .save()
    .then(async () => {
      await User.updateMany(
        { "channels.name": data.room.toLowerCase(), username: { $ne: data.user } },
        { $inc: { "channels.$.newMsgCount": 1 } }
      );
      const findAllUser = await User.find(
        { "channels.name": data.room.toLowerCase() },
        { username: 1, _id: 0 }
      );
      findAllUser.forEach((element) => {
        socket
          .to(element.username)
          .emit("channelAdded", { isChannelAdd: true });
      });
      console.log(
        `${data.user} (${socket.id}) sent message ${data.msg} to channel ${data.room}`
      );
    })
    .then(null, (error) => console.log(`error sending message: ${error}`));
};

const handleDisconnect = (socket) => () => {
  console.log(`${socket.id} one of clients has disconnected`);
};

module.exports = (io) => {
  io.sockets.on("connection", (socket) => {
    socket.on("login", async (data) => {
      data.username = data.username.toLowerCase();
      socket.join(data.username);
      console.log(
        `${data.username} is now is now connected with new client ${socket.id}`
      );
    });
    socket.on("addChannel", async (data, callback) => {
      const newChannel = new Channel({
        name: data.roomName,
      });
      const { _id } = await newChannel.save();
      await User.updateMany(
        { username: { $in: data.username } },
        { $push: { channels: { id: _id, name: data.roomName } } }
      );
      callback({
        status: "ok"
      });
      data.username.forEach((element) => {
        socket.in(element).emit("channelAdded", { isChannelAdd: true });
      });
    });

    socket.on(events.join, handleJoin(socket));

    socket.on(events.msgSend, handleMsg(socket));

    socket.on(events.disconnect, handleDisconnect(socket));
  });
};
