const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    username: {
      type: mongoose.Schema.Types.String,
      unique: true,
      required: true,
    },
    password: {
      type: mongoose.Schema.Types.String,
      required: true,
    },
    channels: [
     {
       id:mongoose.Schema.Types.String,
       name:mongoose.Schema.Types.String,
       newMsgCount:mongoose.Schema.Types.Number,
       timestamp: {
        type: mongoose.Schema.Types.Date,
        default: Date.now,
      },
     }
    ],
    online: {
      type: mongoose.Schema.Types.Boolean,
      default: false,
    },
});

UserSchema.pre('save', function (next) {
  this.username = this.username.toLowerCase()
  next()
});

const saltRounds = 10

UserSchema.methods.generateHash = function generateHash (password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(saltRounds));
}

UserSchema.methods.validPassword = function isValidPassword (password) {
  return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);
