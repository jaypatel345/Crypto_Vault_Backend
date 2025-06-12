const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  useraddress: {
    type: String,
    required: true,
  },
  encryptionkey: {
    type: Buffer,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;