const mongoose = require('mongoose')
const Schema = mongoose.Schema
const Review = require('./review')

const listingschema = Schema({
    title:{
        type: String,
        
    },
    description :  String,
    image : {
        url: String,
        filename: String
    },
    price: Number,
    location:String,
    country : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : "Review"
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    },
    category:{
        type: String,
        enum: ["resort","restaurant","mountains","river","beach","lake","desert","island","forest","camping","cabin","castle","villa","apartment","bungalow","farmhouse","treehouse","houseboat","tent","luxury","budget","heritage","city","countryside","other"],
        required : true,
        default: "other"
    },
    
})

listingschema.post("findOneAndDelete" , async(listing) =>{
    if(listing){
        await Review.deleteMany({ _id : {$in : listing.reviews}})
    }
})

const Listing = mongoose.model("listing" , listingschema)
module.exports = Listing;

