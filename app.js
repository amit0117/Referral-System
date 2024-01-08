/* Importing Different Modules */
const dotenv=require('dotenv')
const express = require("express")
const mongoose = require("mongoose")
const path = require('path')
const passport = require('passport')
const hbs = require("express-handlebars")
const flash = require("connect-flash")
const session = require("express-session")
const app = express()
const authRoutes = require("./app/routes/auth.routes")
const profileRoutes = require("./app/routes/profile.routes")
const referralRoutes = require("./app/routes/referral.routes")
const {notFound}=require('./app/middlewares/errormiddleware')
const initializePassport=require('./config/passportconfig')
dotenv.config()

// Configure Mongoose to Connect to MongoDB
const mongoDbUrl=process.env.MONGODB_URI
const PORT=process.env.PORT||3000

mongoose
.connect(mongoDbUrl)
.then((response) => {
  console.log("MongoDB Connected Successfully.")
})
.catch((err) => {
  console.log(err)
  console.log("Database connection failed.")
})
app.use(
  session({
    secret:process.env.MONGODB_SESSION_SECRET,
    saveUninitialized: false,
    resave: false,
  })
)
/* Configure express*/
app.set("view engine", "handlebars")
app.engine("handlebars",hbs({defaultLayout: "default"}))
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, "public")))

// initializing the passport includes serializing and deserializing the user into session
initializePassport(passport)

/*  Flash and Session*/
app.use(flash())

/* Passport Initialize */
app.use(passport.initialize())
app.use(passport.session())


// flash messeges setup
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.user = req.user || null;
  next();
})

// using routes
app.use('/api/referral',referralRoutes)
app.get('/api/balance',profileRoutes)
app.use('/api/',authRoutes)
app.use('/dashboard',profileRoutes)
app.use('/',authRoutes)


//middleware for handling if no any above routes matches 
app.use(notFound)

//middleware for handling all the intermediate errors
app.use((err, req, res, next) => {
  console.log("inr error middleware")
  const { status = 500 } = err
  if (!err) err.message = 'Oops!! Something went wrong ...'
  res.status(status).render('error', { err})
})

/* Start The Server */
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
