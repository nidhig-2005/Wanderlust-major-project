const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");

//signup route
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

//signup post route
router.post("/signup",wrapAsync(async (req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({username,email});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.flash("success","Welcome to Wanderlust!");
    res.redirect("/listings");
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
}));

//login route
router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});
//login post route
router.post("/login",passport.authenticate("local",{
    failureFlash:true,
    failureRedirect:"/login"
}),
async (req,res)=>{
    req.flash("success","Welcome back!");
    res.redirect("/listings");
});

//logout route
router.get("/logout",(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        } 
        req.flash("success","You have logged out successfully!");
        res.redirect("/listings");
    });
});

module.exports=router;