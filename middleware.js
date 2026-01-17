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