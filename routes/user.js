const express=require("express");
const router=express.Router();
const User=require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport=require("passport");
const { saveRedirectUrl } = require("../middleware.js");

const userscontrollers=require("../controllers/users.js");
 
//signup route
router.route("/signup")
.get(userscontrollers.renderSignup)
.post(wrapAsync(userscontrollers.signupForm));

//login route
router.route("/login")
.get(userscontrollers.renderLogin)
.post(saveRedirectUrl,passport.authenticate("local",{
    failureFlash:true,
    failureRedirect:"/login"
}),userscontrollers.loginPostForm);

//logout route
router.get("/logout",userscontrollers.logoutUser);

module.exports=router;