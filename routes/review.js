const express = require('express')
const router = express.Router({mergeParams : true });
const WrapAsync = require("../utils/WrapAsync")
const ExpressError = require('../utils/ExpressError')
const { reviewschema}  = require('../Schema')
const Listing = require('../models/listing')
const Review = require('../models/review');
const { isLoggedin, isreviewAuthor } = require('../middleware');
const { createReview, destroyReview } = require('../controllers/review');

const validatereview = (req, res , next) =>{
  let {error} = reviewschema.validate(req.body)
  if(error){
    let errmsg = error.details.map((el)=> el.message).join(",")
    throw new ExpressError(400, errmsg)
  }else{
    next();

  }
}

router.post('/', isLoggedin, validatereview, WrapAsync(createReview))

router.delete('/:reviewid' , isLoggedin, isreviewAuthor, WrapAsync(destroyReview))


module.exports = router;