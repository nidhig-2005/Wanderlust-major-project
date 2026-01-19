const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const Listing=require("../models/listing.js");
const {isLoggedIn,isOwner,validateListing}=require("../middleware.js");


const listingsController=require("../controllers/listings.js");

//index and create route
router
.route("/")
.get(wrapAsync(listingsController.index))
.post(isLoggedIn,validateListing,
    wrapAsync(listingsController.createListing));

//new route
router.get("/new",isLoggedIn,listingsController.newListingForm);

 //show, update and delete route
router.route("/:id")
.get(wrapAsync(listingsController.showListing))
.put(
    isLoggedIn,isOwner,validateListing,
    wrapAsync(listingsController.updateListing))
.delete(
    isLoggedIn,isOwner,wrapAsync(listingsController.destroyListing));

//edit route
router.get("/:id/edit",
    isLoggedIn,isOwner,
    wrapAsync(listingsController.editListingForm));

module.exports=router;
