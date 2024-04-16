const mongoose = require('mongoose');
// const { type } = require('os');


const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  occupation: {
    type: String,
    required: true,
  },
  address:{
    type: String,
    required: true,
  },
  role:{
    type: String,
    default: "user",
  }
  // pin:{
  //   type: String,
  //   required: true,
  // },
});

userSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

userSchema.set("toJSON", {
  virtuals: true,
});


exports.User = mongoose.model("User", userSchema);
exports.userSchema = userSchema;
