const user = require('../models/user');


module.exports.signupform = (req, res)=>{
    res.render("user/signup.ejs")
}

module.exports.signupuser = async(req, res)=>{
    try{
        let {username, email, password} = req.body;
    let newUser = new user({email, username})
    const registeduser = await user.register(newUser, password)
    req.login(registeduser, (err)=>{
        if(err){
            return next(err)
        }
        req.flash("success", "Welcome to Wanderlust")
        res.redirect("/listings")
    })
    
    } catch(e){
        req.flash("error", e.message)
        res.redirect("/signup")
    }
}
module.exports.loginform = (req, res)=>{
    res.render("user/login.ejs")
}

module.exports.loginuser = async(req, res)=>{
    req.flash("success", "Welcome back to Wanderlust")
    let redirectlink = res.locals.redirectUrl || "/listings"
    res.redirect(redirectlink)
}

module.exports.logoutuser = (req,res,next)=>{
    req.logout((err)=>{
        if(err){
            next(err)
        }
        req.flash("success","You Are Logged Out Now")
        res.redirect("/listings")
    })
}