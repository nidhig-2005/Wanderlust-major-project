require("dotenv").config();

const express= require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const dbUrl=process.env.ATLASDB_URL;

const ejsMate=require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const listingRouter=require("./routes/listing.js");
const reviewRouter=require("./routes/review.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
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
    await mongoose.connect(dbUrl);
};

console.log(process.env.ATLASDB_URL);

//app config
app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"public")));


const store=MongoStore.create({
    mongoUrl:dbUrl,
});

store.on("error",(err)=>{
    console.log("ERROR IN MONGO SESSION STORE",err);
});

app.set("trust proxy", 1);

//session config
const sessionOptions={
    store:store,
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    cookie:{
        expires:Date.now()+7*24*60*60*1000,
        maxAge:7*24*60*60*1000,
        httpOnly:true,
        sameSite:"lax"
},
};

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
    res.locals.currentUser=req.user||null;
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
    if (res.headersSent){
        return next(err);
    }
    let {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
});

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
});