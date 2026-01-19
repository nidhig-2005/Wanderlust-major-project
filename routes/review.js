const express=require("express");
const app=express();
const router=express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js")
const ExpressError=require("../utils/ExpressError.js");
const Review=require("../models/review.js");
const Listing=require("../models/listing.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../middleware.js");

const reviewscontrollers=require("../controllers/reviews.js");

//reviews
//post route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewscontrollers.postReview));

//delete review route
router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewscontrollers.destroyReview));

module.exports=router;