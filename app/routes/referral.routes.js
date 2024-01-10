const express = require('express')
const router = express.Router()
const referralcontroller = require('../controllers/referral.controller')
const { isUserAuthenticated } = require('../middlewares/auth')
const referralController = require('../controllers/referral.controller')
const asyncHandler=require('express-async-handler')
router.all('*', isUserAuthenticated, (req, res, next) => {
  req.app.locals.layout = 'admin'
  next()
})

//Referral Routes

router.post('/generate',isUserAuthenticated,asyncHandler(referralcontroller.generateReferralLink))

router.post('/expire',isUserAuthenticated,asyncHandler(referralcontroller.expireReferralLink))

router.post('/verify',isUserAuthenticated,asyncHandler(referralController.verify))

module.exports = router