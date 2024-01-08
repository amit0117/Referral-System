const Referral = require('../models/referral')

module.exports = {
  //Dashboard Controller for Referrals
  getProfile: async (req, res) => {
    await Referral.findOne({ userId: req.user._id })
      .populate('userId') //Populate model with user
      .then(loggedUser => {
        //Generate random referral link
        const generatedRefLink = `${req.protocol}://${req.headers.host}/register?reflink=${loggedUser.referralLink}`
        res.render('admin/index', {
          loggedUser: loggedUser,
          generatedRefLink: generatedRefLink
        })
      })
  }
}
