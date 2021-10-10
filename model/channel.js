const { Schema, model } = require("mongoose");

const channelSchema = Schema({
  name: {
    type: Schema.Types.String,
    unique: true,
    required: true,
  },
});

channelSchema.pre("save", function (next) {
  this.name = this.name.toLowerCase();

  next();
});

const channel = model("Channel", channelSchema);
module.exports = channel;
