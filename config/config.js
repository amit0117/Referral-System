const dotenv = require('dotenv');

if (process.env.NODE_ENV !== 'production') {
  dotenv.config();
}

module.exports = {
  globalVariables: (req, res, next) => {
    res.locals.success_message = req.flash("success");
    res.locals.error_message = req.flash("error");
    res.locals.user = req.user || null;
    next();
  },
  // setting up a mongo secret
  SECRET: process.env.MONGODB_SESSION_SECRET,
};
