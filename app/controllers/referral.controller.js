const Referral = require('../models/referral')
const User=require('../models/user')
module.exports = {
  //Dashboard Controller for Referrals
  generateReferralLink: async (req, res) => {
    await Referral.findOne({ userId: req.user._id })
      .populate('userId') //Populate model with user
      .then(loggedUser => {
        //Generate random referral link
        req.flash("success","Referral Link Generated Successfully")
        const generatedRefLink = `${req.protocol}://${req.headers.host}/register?reflink=${loggedUser.referralLink}`
        res.render('default/index', {
          loggedUser: loggedUser,
          generatedRefLink: generatedRefLink
        })
      })
  },
  expireReferralLink:async(req,res)=>{

     const user=await User.findById(req.user._id)
     if(user){
        if(user.isExpired){
            req.flash("error","This Referral is already expired.")
            return res.redirect('/dashboard')
        }
        else{
           user.isExpired=true;
           await user.save();
            req.flash("success","Referral link expired Successfully")
            return res.redirect('/dashboard')
        }
     }else{
        req.flash("error","This Referral Doesnot exist.")
        return res.redirect('/dashboard')
     }
  },
  verify:async(req,res)=>{
    const user=await User.findById(req.user._id)
    if(user){
       if(user.isExpired){
           req.flash("error","This Referral has expired.")
           return res.redirect('/dashboard')
       }
       else{
           req.flash("success","This Referral is still active.")
           return res.redirect('/dashboard')
       }
    }else{
       req.flash("error","Invalid Referral.")
       return res.redirect('/dashboard')
    }
  }
}
