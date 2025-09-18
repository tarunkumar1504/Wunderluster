const express = require('express')
const router = express.Router();
const WrapAsync = require("../utils/WrapAsync")
const ExpressError = require('../utils/ExpressError')
const {listingSchema }  = require('../Schema')
const Listing = require('../models/listing')
const {isLoggedin, isOwner} = require('../middleware');
const { index, newform, showListing, createListing, editForm, updateListing, destroyListing, serachListing, listingCat } = require('../controllers/listing');
const multer  = require('multer')
const {storage} = require("../cloudConfigurer")
const upload = multer({storage})


const validatelisting = (req, res , next) => {
  let {error} = listingSchema.validate(req.body)
  if(error){
    let errmsg = error.details.map((el)=> el.message).join(",")
    throw new ExpressError(400, errmsg)
  }else{
    next();

  }
}

router.get('/' , WrapAsync(index))

router.get('/new' , isLoggedin, WrapAsync(newform))

router.get('/search', WrapAsync(serachListing))


router.post('/' , isLoggedin, validatelisting, upload.single("listing[image]"), WrapAsync(createListing))
router.get("/category/:category", WrapAsync(listingCat));

router.get('/:id' ,WrapAsync(showListing))
router.get('/:id/edit', isLoggedin, isOwner, WrapAsync(editForm))

router.put('/:id', isLoggedin, isOwner, upload.single("listing[image]"), WrapAsync(updateListing))

router.delete('/:id', isLoggedin, isOwner, WrapAsync (destroyListing))

module.exports = router 