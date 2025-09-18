const mongoose = require('mongoose')
const initdata = require('../init/data')
const Listing = require('../models/listing')



main()
.then(r => {console.log("connected")})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');

}

const initdb = async () => {
    await Listing.deleteMany({})
    initdata.data = initdata.data.map((obj)=>({...obj, owner:"689f6f9040b8819e63cf529b"}))
    await Listing.insertMany(initdata.data);
    console.log("data entered")
}

initdb()