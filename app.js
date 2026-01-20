if(process.env.NODE_ENV!=="production"){
    require("dotenv").config();
}

const express= require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const User=require("./models/user.js");
const LocalStrategy=require("passport-local");
const userRouter=require("./routes/user.js");

//connect to mongoDB
main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL);
}

//app config
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));``

//session config
const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true
},
};

app.get("/",(req,res)=>{
    res.send("root working");
});

//use session and flash
app.use(session(sessionOptions));
app.use(flash());

//passport config
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());//how to store user in session
passport.deserializeUser(User.deserializeUser());//how to get user from session

//flash middleware
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currentUser=req.user;
    next();
});

//demo user route
app.get("/demouser",async(req,res)=>{
    let fakeUser=new User({
        email:"demo@gmail.com",
        username:"demoUser"
    });
    let registeredUser=await User.register(fakeUser,"demoPass");
    res.send(registeredUser);
});

//listings 
app.use("/listings",listingRouter);

//reviews
app.use("/listings/:id/reviews",reviewRouter);

//user 
app.use("/",userRouter);

//for handling all other routes not defined
app.use((req,res,next)=>{
    next(new ExpressError(404,"Page Not Found!"))
});

//middleware
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});