const Listing = require("../models/listing");
const Review = require('../models/review');


module.exports.createReview = async (req, res) =>{
  let listing = await Listing.findById(req.params.id);
  let newreview = new Review(req.body.review)
  newreview.author = req.user._id
  listing.reviews.push(newreview);

  await newreview.save();
  await listing.save();
    req.flash("success", "New Review Created")
  // res.send("review saved")
  res.redirect(`/listings/${listing._id}`)
}
module.exports.destroyReview = async(req,res, next) =>{
  let {id , reviewid} = req.params;

  await Listing.findByIdAndUpdate(id , {$pull : {reviews : reviewid}})
  await Review.findByIdAndDelete(reviewid)
    req.flash("success", "Review Deleted")
  res.redirect(`/listings/${id}`)
}