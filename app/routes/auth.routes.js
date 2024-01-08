const express = require('express')
const router = express.Router()
const authController = require('../controllers/auth/auth.controller')
const passport = require('passport')

router.all('/*', (req, res, next) => {
  req.app.locals.layout = 'default'
  next()
})

router.get('/', (req, res) => {
  res.redirect('/api/login')
})
router.get('/login',authController.getLoginPage)

router.post('/login',
passport.authenticate('local',{
    failureRedirect:"/api/login",
    failureFlash:true,
    successFlash:true
  }),authController.Login);

// Register Rout
router.get('/register',authController.getRegisterPage)
router.post('/register',authController.registerUser)

//Logout Route
router.get('/logout', (req, res) => {
  req.logOut()
  req.flash('success', 'Logout was successful')
  res.redirect('/api/login')
})

module.exports = router


