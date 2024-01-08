const mongoose = require("mongoose")
const Schema = mongoose.Schema
const passportLocalSchema=require('passport-local-mongoose')

const UserSchema = new Schema({
  fullname: {
    type: String,
    required: true,
  },
  email: {
    type: String, require: true, index:true, unique:true,sparse:true
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  refId: {
    type: Schema.Types.ObjectId,
    ref: "Referral",
  },referredNumber:{
    type:Number,
    default:0
  },balance:{
   type:Number,
   default:0
  },
  isExpired:{
   type:Boolean,
   default:false
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
})

UserSchema.plugin(passportLocalSchema)
const User = mongoose.model("User", UserSchema);

module.exports = User;
