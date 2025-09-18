const Listing = require("../models/listing")


module.exports.index =  async (req, res) =>{
  const allListings = await Listing.find({})
  res.render("listings/index.ejs" ,{allListings} )

}
module.exports.newform =  async (req, res) =>{
    res.render("listings/new.ejs")
}
module.exports.showListing =  async (req, res) =>{
    let {id} = req.params;
    const listing = await Listing.findById(id)
    .populate({
      path : "reviews", 
      populate:{
        path:"author"
      },
    })
    .populate("owner")
    if(!listing){
      req.flash("error", "Listing that requested you does not exist")
      return res.redirect("/listings")
    }
    res.render("listings/show.ejs", {listing})
}

module.exports.createListing =  async (req, res , next) =>{
    if(!req.body.listing){
      throw new ExpressError(400, "Enter Valid Data")
    }
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing)
    newListing.owner = req.user._id
    newListing.image = {url , filename}
    

    await newListing.save();
    req.flash("success", "New Listing Created")
    res.redirect("/listings")
   
}

module.exports.editForm = async (req,res)=>{
  let {id} = req.params;
    const listing = await Listing.findById(id)
    if(!listing){
      req.flash("error", "Listing that requested you does not exist")
       return res.redirect("/listings")
    }
    let originalimg = listing.image.url;
    originalimg = originalimg.replace("/upload","/upload/w_200")
    res.render("listings/edit.ejs", {listing, originalimg})
}
module.exports.updateListing = async (req,res)=>{
  if(!req.body.listing){
      throw new ExpressError(400, "Enter Valid Data")
    }
  let {id} = req.params;
  let listing = await Listing.findByIdAndUpdate(id , {...req.body.listing})

  if(typeof req.file !== "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = {url,filename}
    await listing.save();
  }
    req.flash("success", "Listing Updated")
  res.redirect(`/listings/${id}`)
}
module.exports.destroyListing = async (req,res)=>{
  let {id} = req.params;
  await Listing.findByIdAndDelete(id)
    req.flash("success", " Listing Deleted")
  res.redirect('/listings')
}

module.exports.serachListing = async(req,res)=>{
  let query = req.query.q?.trim();

  if(!query || query.length === 0 ){
    req.flash("error", "Please enter a Search term")
    return res.redirect('/listings')
  }

  const results = await Listing.find({
    $or: [
      { title: { $regex: query, $options: "i" } },
      { country: { $regex: query, $options: "i" } },
      { location: { $regex: query, $options: "i" } }
    ]
  })

  if(results.length === 0){
     req.flash("error", `No results found for "${query}"`)
    return res.redirect('/listings')
  }
   res.render("listings/search.ejs", { results, query });
}

module.exports.listingCat = async(req, res)=>{
  let category = req.params.category
   const allListings = await Listing.find({ category });



   if (allListings.length === 0) {
    req.flash("error", `No listings found in category: ${category}`);
    return res.redirect("/listings");
  }
  res.render("listings/index.ejs", { allListings, category });
}