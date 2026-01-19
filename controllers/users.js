const User=require("../models/user.js");
//signup route
module.exports.renderSignup=(req,res)=>{
    res.render("users/signup.ejs");
};

//signup post route
module.exports.signupForm =async (req,res)=>{
    try{
    let {username,email,password}=req.body;
    const newUser=new User({username,email});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    //login the user after signup
    req.login(registeredUser,(err)=>{
        if(err){
            return next(err);
        } 
        req.flash("success","Welcome to Wanderlust!");
    res.redirect("/listings");
    });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
};

//login route
module.exports.renderLogin=(req,res)=>{
    res.render("users/login.ejs");
};

//login post route
module.exports.loginPostForm=async (req,res)=>{
    req.flash("success","Welcome back!");
    let redirectUrl=res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
};

//logout route
module.exports.logoutUser=(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        } 
        req.flash("success","You have logged out successfully!");
        res.redirect("/listings");
    });
};