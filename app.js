var express					=require("express");
var md5						=require("md5");
var User					=require("./models/user");
var mongoose 				=require("mongoose");
var passport				=require("passport");
var LocalStrategy			=require("passport-local");
var nodemailer 				=require('nodemailer');
var bodyparser				=require("body-parser");
var app=express();


//===================================================================================
//									OTHER SETTINGS
//===================================================================================
app.set("view engine","ejs");
app.use(express.static("public"));
app.use(bodyparser.urlencoded({extended:false}));
//====================================================================================



//==================================================================================
//									DATABASE SETTING
//==================================================================================
mongoose.connect("mongodb+srv://akash:akash*123@cluster0-yylhs.mongodb.net/test?retryWrites=true&w=majority",{
	useNewUrlParser:true,
	useCreateIndex:true
});
//mongoose.connect("mongodb://localhost/quiz");
//=================================================================================s
//==================================================================================
//                                  AUTHENTICATION SETTING
//==================================================================================
app.use(require("express-session")({
	secret:"Rusty is the best and the cutest",
	resave:false, 
	saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()) );
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req,res,next){
	res.locals.currentUser=req.user;
	next();
});
//==================================================================================



//==================================================================================
//                                  EMAIL SETTING
//==================================================================================
                 
var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'aroy0761@gmail.com',
                        pass: 'sayankarmakar'
                    }
                });
//===================================================================================





app.get("/",function(req,res){res.render("index"); });
app.get("/signup",function(req,res){
	res.render("signup");
});
//=========================
//MAILING ROUTES
//=========================
app.post("/credentials",function(req,res){
	var otp=Math.floor((Math.random() * 100) + 54);
	var mailOptions = {
		
                    from: 'aroy0761@gmail.com', // sender address 
                    to: req.body.username, // list of receivers 
                    subject: 'QUIZINE OTP', // Subject line 
                    html: 'Your one time password is : '+otp  // html body 
                };

                transporter.sendMail(mailOptions, function (err, info) {
                    if(err){console.log(err);}
					else {
						console.log(otp);
						res.render("checkotp",{otp:md5(otp.toString()),name:req.body.name,username:req.body.username,password:req.body.password,message:""});
					}
              });
	
	
});
app.post("/checkotp",function(req,res){
		if(req.body.actualotp==md5(req.body.otp)){
		var newUser=new User({username:req.body.username});
	User.register(newUser,req.body.password,function(err,user){
		if(err)
			{
				console.log(err);
				res.render("signup");
			}
		else{
			passport.authenticate("local")(req,res,function(){
				res.redirect("/user");
			});
		}
	});
		
		
		
	}
	else{
		res.render("checkotp",{name:req.body.name,otp:req.body.actualotp,username:req.body.username,password:req.body.password,message:"Seriously!!!! Are you kidding?????? You entered a wrong OTP try again. "});
	}
});

app.get("/login",function(req,res){res.render("login");});
app.post("/login",passport.authenticate("local",{ 
	successRedirect:"/user",
	failureRedirect:"/login"
}),function(req,res){
	
});

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});
app.get("/user",function(req,res){res.render("user");});
// app.listen(process.env.PORT,process.env.IP,function(){
// console.log("App started");
// });
app.listen(3000,function(){
console.log("App started");
});