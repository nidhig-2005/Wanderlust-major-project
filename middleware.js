const Listing = require("./models/listing.js");
const ExpressError = require("./utils/ExpressError.js");
const { listingSchema ,reviewSchema} = require("./schema.js");
const Review = require("./models/review.js");

//middleware to check if user is logged in
module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        //redirecturl save
        req.session.redirectUrl=req.originalUrl;
        req.flash("error","You must be logged in to create a listing");
        return res.redirect("/login");
    };
    next();
};

//middleware to save redirect url for login
module.exports.saveRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
    }
    next();
    };

    //middleware to check if user is owner of listing
module.exports.isOwner=async(req,res,next)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
        if(!listing.owner.equals(res.locals.currentUser._id)){
        req.flash("error","You are not authorized to do this action");
        return res.redirect(`/listings/${id}`);

    }
    next();
};

//validate listing middleware
module.exports.validateListing=(req,res,next)=>{
       let {error}=listingSchema.validate(req.body);

    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};


//validate review middleware
module.exports.validateReview=(req,res,next)=>{
       let {error}=reviewSchema.validate(req.body);

    if(error){
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next();
    }
};

//
module.exports.isReviewAuthor=async(req,res,next)=>{
    let {id,reviewId}=req.params;
    const review=await Review.findById(reviewId);
        if(!review.author.equals(res.locals.currentUser._id)){
        req.flash("error","You are not authorized to do this action");
        return res.redirect(`/listings/${id}`);

    }
    next();
};