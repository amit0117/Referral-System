const Referral = require("../models/referral")
const User = require("../models/user")

module.exports = {
  //Check if referral is valid and gets the referrer ID
  checkReferer: async (query) => {
    try {
      const referral = await Referral.findOne(query).populate({
        path: "userId",
      })
        if(referral){
        try{

        
        const referrarId=referral.userId._id
        const user=await User.findById(referrarId)
        const currTime=new Date()
        const referralCreatedDate=user.createdAt
        const difference=currTime-referralCreatedDate
        const dayElapsed=difference/(24*60*60*1000)
        const totalReferralTillNow=user.referredNumber
        // checking for validity of the referral
        // i have assumed time limit as 15 days and max Number of Reffer=5
        if((!user.isExpired) && dayElapsed<=15 && totalReferralTillNow<5){
          return referral
        }else if (!user.isExpired){
          user.isExpired=true;
          await user.save()
        }
      
        else {
          return null
        }

      }catch(error){
          throw new Error(error)
      }
      }
      if (!referral) {
        throw new Error("Invalid Referral")
      }
      return referral
    } catch (err) {
      throw new Error(err)
    }
  },
  updateReferer:async(query)=>{
    const referral = await Referral.findOne({ referralLink: query }).populate({
      path: "userId",
    })
    if(referral){
      const referrarId=referral.userId._id
      const user=await User.findById(referrarId)
      const currTime=new Date()
      const referralCreatedDate=user.createdAt
      const difference=currTime-referralCreatedDate
      const dayElapsed=difference/(24*60*60*1000)
      const totalReferralTillNow=user.referredNumber
      if((!user.isExpired) && dayElapsed<=15 && totalReferralTillNow<5){
      user.referredNumber+=1;
      user.balance=5000*user.referredNumber;
      await user.save();
      }
      else if (!user.isExpired){
        user.isExpired=true;
        await user.save()
      }
    }
}
}
