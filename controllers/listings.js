const Listing=require("../models/listing");

//index controller
module.exports.index=async (req,res)=>{
    const allListings=await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    };

 //new controller
module.exports.newListingForm=(req,res)=>{
    res.render("listings/new.ejs");
    };

// show controller
module.exports.showListing=(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id)
    .populate({path:"reviews",populate:{path:"author"}})
    .populate("owner");
    if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs",{listing});
});

//Create controller
module.exports.createListing=(async (req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;

         const newListing=new Listing(req.body.listing);
        newListing.owner=req.user._id;
        newListing.image={url,filename};
    await newListing.save();
    req.flash("success","New Listing created!");
    res.redirect("/listings");
});

//edit controller
module.exports.editListingForm=(async (req,res)=>{
     let {id}=req.params;
    const listing=await Listing.findById(id);
     if(!listing){
        req.flash("error","Listing not found");
        return res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
});

//update controller
module.exports.updateListing=(async(req,res)=>{
     if(!req.body.listing){
        throw new ExpressError(400,"Send Valid Data for Listing");
    }
    let {id}=req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing updated!");
    res.redirect(`/listings/${id}`);
});

//delete controller
module.exports.destroyListing=(async(req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing deleted");
    res.redirect("/listings");
});
