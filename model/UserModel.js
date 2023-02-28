const mongoose = require("mongoose");
var jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const UserModelSchema = new Schema({
  name: { type: "String", required: true },
  email: { type: "String", unique: true, required: true },
  password: { type: "String", required: true },
  pic: {
    type: "String",
    required: true,
    default:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
  isAdmin: {
    type: Boolean,
    required: true,
    default: false,
  },
  token: {
    type: String,
    default: ""
  }
  // name: { type: "String", required: true },
  // email: { type: "String", unique: true, required: true, unique: true },
  // password: { type: "String", required: true },
  // pic: {
  //   type: "String",
  //   default:
  //     "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  // },
  // isAdmin: {
  //   type: Boolean,
  //   required: true,
  //   default: false,
  // },
  // token: {
  //   type: String,
  //   default: ""
  // }

}, {
  timestamps: true
})
UserModelSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
    console.log(this.password);
  }
  next();
})
UserModelSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
UserModelSchema.methods.generateAuthToken = async function () {
  try {
    let token = jwt.sign({ _id: this.id }, process.env.SECRET_KEY);
    this.token = await token;
    await this.save();
    return token;
  } catch (error) {
    console.log(error.message);
  }
}

const User = mongoose.model("User", UserModelSchema)

module.exports = User;