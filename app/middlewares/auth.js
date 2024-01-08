module.exports = {
  //Checks if user is authenticated
  isUserAuthenticated: (req, res, next) => {
    if (req.isAuthenticated()) {
      next()
    } else {
     return res.redirect('/api/login')
    }
  },
  isNotUserAuthenticated:(req,res,next)=>{
  if(req.isAuthenticated){
    return res.redirect('/dashboard')
  }else{
    next()
  }
  }
}
