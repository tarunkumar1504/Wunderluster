const Listing = require("./models/listing");
const review = require("./models/review");

module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You Must Need To Logged In")
        return res.redirect("/login")
    }
    next()
}
module.exports.saveRedirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl
    }
    next()
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
  let listing = await Listing.findById(id);
  if(!listing.owner.equals(res.locals.currUser._id)){
    req.flash("error","You are not owner of this Listing")
    return res.redirect(`/listings/${id}`)
  }
  next()
}

module.exports.isreviewAuthor = async (req,res,next)=>{
    let {id , reviewid} = req.params;
  let myreview = await review.findById(reviewid);
  if(!myreview.author.equals(res.locals.currUser._id)){
    req.flash("error","You are not Author of this Review")
    return res.redirect(`/listings/${id}`)
  }
  next()
}