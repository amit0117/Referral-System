const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReferralSchema = new Schema({
  referralId: {
    type: String
  },
  referralLink: {
    type: String
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now()
  }
})

const Referral = mongoose.model("Referral", ReferralSchema);

module.exports = Referral;
