const bcrypt = require("bcryptjs")
const User = require("../../models/user")
const Referral = require("../../models/referral")
const ReferralService = require("../../services/referral.service")
const { v4: uuidv4 } = require("uuid")
const {registerValidation,loginValidation}=require('../../utils/validation.utlis')
const referralService = require("../../services/referral.service")



module.exports = {
  /* LOGIN ROUTES */
  getLoginPage: (req, res) => {
    res.render("default/login", { message: req.flash("error") })
  },

  /* REGISTER ROUTES*/
  getRegisterPage: async (req, res) => {
    //Checks if register link contains query "reflink"
     var reflink=""
    if (req.query.reflink && req.query.reflink!="" ) {
      //Validate referral link and gets the referrer
      const referral = await ReferralService.checkReferer({
        referralLink: req.query.reflink,
      })
      // updating the user referred number by one 
      // so that it's balance increase by 5000
      //Sends  a flash message of the referrer
      if(referral){
      reflink=req.query.reflink
      req.flash("success","You were referred by " + referral.userId.fullname)
    }
    } 
      return res.render("default/register",{reflink})
  },
  registerUser: async (req, res, next) => {
    try {
      const { error } = registerValidation.validate({
        fullname: req.body.fullname,
        email: req.body.email,
        password: req.body.password,
      })  
      if (error) {
        error.details.forEach(el => req.flash("error", el.message));
        return res.redirect('/api/register');
      }
  
      const existingUser = await User.findOne({ email: req.body.email });
  
      if (existingUser) {
        req.flash("error", "Email already exists, try to login instead.");
        return res.redirect("/api/login");
      }
       const reflink=req.body.reflink
      if (reflink && reflink !== "") {
        await referralService.updateReferer(reflink);
      }
  
      const { fullname, email, password } = req.body;
      const newUser = new User({
        fullname: fullname,
        email: email,
        password: password,
      });
  
      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(newUser.password, salt);
  
      newUser.password = hash;
  
      const user = await newUser.save();
  
      const newReferrer = new Referral({
        referralId: uuidv4(),
        referralLink: uuidv4(),
        userId: user._id,
      });
  
      await newReferrer.save();
  
      req.flash("success", "You are now registered");
      return res.redirect("/api/login");
    } catch (error) {
      req.flash("error", "An error occurred during registration.");
      return res.redirect("/api/register");
    }

  },
Login:(req,res)=>{
  const {error}= loginValidation.validate(req.body);
  if (error) {
    error.details.forEach(el=>req.flash("error",el.message))    
    return res.redirect('/api/register');
  } 
    //if user koi aur route pe jana chahta hai but o login nhi hai
    // hai to after login use whi route pe bhej denge
    const redirectUrl=req.session.returnTo||'/dashboard'
    delete req.session.returnTo
    return res.redirect(redirectUrl)
    }
}
