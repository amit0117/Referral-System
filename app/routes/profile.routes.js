const express = require('express')
const router = express.Router()
const profileController = require('../controllers/profile.controller')
const { isUserAuthenticated } = require('../middlewares/auth')
const asyncHandler=require('express-async-handler')
router.all('*', isUserAuthenticated, (req, res, next) => {
  req.app.locals.layout = 'admin'
  next()
})

//Profile Route

router.route('/').get(asyncHandler(profileController.getProfile))

module.exports = router
