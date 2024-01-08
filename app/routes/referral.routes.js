const express = require('express')
const router = express.Router()
const referralcontroller = require('../controllers/referral.controller')
const { isUserAuthenticated } = require('../middlewares/auth')
const referralController = require('../controllers/referral.controller')

router.all('*', isUserAuthenticated, (req, res, next) => {
  req.app.locals.layout = 'admin'
  next()
})

//Referral Routes

router.post('/generate',isUserAuthenticated,referralcontroller.generateReferralLink)

router.post('/expire',isUserAuthenticated,referralcontroller.expireReferralLink)

router.post('/verify',isUserAuthenticated,referralController.verify)

module.exports = router