if(process.env.NODE_ENV != "production"){
  require('dotenv').config()
}

let express = require("express")
const app = express()
const port = 3000
const mongoose = require('mongoose')
const path = require('path')
const methodOverride = require('method-override')
const ejsMate = require("ejs-mate")
const ExpressError = require('./utils/ExpressError')
const session = require("express-session")
const MongoStore = require('connect-mongo');
const flash = require("connect-flash")
const passport = require("passport")
const localStragey = require("passport-local")
const User = require("./models/user")

const listings = require('./routes/listing')
const reviews = require('./routes/review')
const userroute = require('./routes/user')

app.set("view engine" , "ejs")
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({extended:true }))
app.use(methodOverride("_method"))
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")))

let Atlasdburl = process.env.MONGODB_URL
// app.get('/' , WrapAsync( async (req, res) =>{
//   res.send("This is root")

// }))
const store = MongoStore.create({
  mongoUrl: Atlasdburl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24*3600
})

store.on("error", () =>{
  console.log("error in mongo session", err)
})

const sessionoptions = {
  store,
  secret : process.env.SECRET,
  resave : false,
  saveUninitailized : true,
  cookie: {
    expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge : 7 * 24 * 60 * 60 * 1000,
    httpOnly : true,
  }
}
app.use(session(sessionoptions))
app.use(flash())

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStragey(User.authenticate()))
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
  res.locals.success = req.flash("success")
  res.locals.error = req.flash("error")
  res.locals.currUser = req.user;
  next();
})



main()
.then(r => {console.log("connected")})
.catch(err => console.log(err));


async function main() {
  await mongoose.connect(Atlasdburl);

}


app.use('/listings' , listings)
app.use('/listings/:id/reviews' , reviews)
app.use('/' , userroute)


app.all("/*splat" , (req , res , next ) =>{
  //  next(new ExpressError(404 , "page not found!"))
  next(new ExpressError(404, "Page Not Found!"))
})

app.use((err , req ,res , next) => {
  let {statuscode = 500 , message = "something went wrong!"} = err;
  res.render('listings/error.ejs' , {message})
  // res.status(statuscode).send(message)
  // res.send("something went wrong!")
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
