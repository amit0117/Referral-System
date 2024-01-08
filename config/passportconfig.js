const LocalStrategy=require('passport-local').Strategy
const User=require('../app/models/user')
const bcrypt=require('bcryptjs')
async function initializePassport(passport){
const authenticateUser=async (email,password,done)=>{
    const user = await User.findOne({ email: email }).select('+password +fullname');
if(user){
try{
    
    if(await bcrypt.compare(password,user.password)){
return done(null,user)
}
else{
return done(null,false,{message:"Incorrect Password"})
}
}catch(err){
return done(err)
}
}else{
return done(null,false,{message:"Incorrect email id or password"})
}
}
passport.use(new LocalStrategy({usernameField:"email",passwordField:"password"},authenticateUser))
passport.serializeUser((user, done) => {
    return done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  });
  
}
module.exports=initializePassport