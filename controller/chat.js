const { room } = require('../model/channel');
const message = require('../model/message');
const User = require('../model/user');

const test = (req, res) => {
	console.log('request', req.body);
	res.send({ message: 'Test run successfully' });
};

const saveRoom = async (req, res) => {
	const { name, createdBy } = req.body;
	const post = new room({
		name,
		createdBy
	});
	await post.save();
	res.send(post);
};

const getRooms = async (req, res) => {
	const { username } = req.params;
	const rooms = await User.findOne({ username }, { channels: 1, _id: 0 }).sort({
		'channels.timestamp': -1
	});
	rooms.channels.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
	res.send(rooms);
};

const unSetNewMsg = async (req, res) => {
	const { name, username } = req.body;
	console.log('room', name);
	await User.updateOne(
		{ username, 'channels.name': name },
		{ $set: { 'channels.$.newMsgCount': 0 } }
	);
	res.send({ message: 'Room updated successfully' });
};

const getMessages = async (req, res) => {
	const { room: roomName } = req.params;
	const data = await message.find({ channel: roomName.toLowerCase() }).sort({ createdAt: 1 });
	console.log('messages', data);
	res.send(data);
};

const getListByChannel = async (req, res) => {
	try {
		const { channel } = req.params;
		const data = await User.find({ channels: channel.toLowerCase() });
		console.log(data);
	} catch (err) {
		console.log('err', err);
	}
};
const addRoomAndUser = async (req, res) => {
	try {
		const { username, roomName } = req.body;
		await User.updateMany(
			{ username: { $in: username } },
			{ $push: { channels: { name: roomName } } }
		);
		res.json({ message: 'Room updated successfully' });
	} catch (err) {
		console.log('err', err);
	}
};
const increaseMsgCount = async (req, res) => {
	try {
		const { user, room } = req.body;
		await User.updateOne(
			{ username: user, 'channels.name': room },
			{ $inc: { 'channels.$.newMsgCount': 1 } }
		);
		res.json({ message: 'Count incremneted successfully' });
	} catch (err) {
		console.log('err', err);
	}
};

const deleteChat = async (req, res) => {
	try {
		const { id, username } = req.body;
		await User.updateOne({ username }, { $pull: { channels: { id: id } } });
		res.json({ message: 'chat deleted successfully' });
	} catch (err) {
		console.log('err==>', err);
	}
};

module.exports = {
	test,
	saveRoom,
	getRooms,
	unSetNewMsg,
	getMessages,
	getListByChannel,
	addRoomAndUser,
	increaseMsgCount,
	deleteChat
};
