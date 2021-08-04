const {Schema,model} = require('mongoose');

const roomSchema = Schema({
    name: String,
    isNewMsg:Boolean,
    createdBy: String
},{
    timestamps: true
});
const messageSchema = Schema({
    room: String,
    content: {
    message: String,
    author: String,
    },
},{
    timestamps: true
})

const room = model('room',roomSchema);
const message = model('message',messageSchema);
module.exports={
    room,
    message
};
