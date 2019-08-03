var express					=require("express");
var md5						=require("md5");
var User					=require("./models/user");
var Forgot					=require("./models/pin");
var NewUser					=require("./models/newuserpin");
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
	res.render("signup",{message:""});
});
app.get("/forgotpassword",function(req,res){
	res.render("forgotpassword",{message:""});
		// Forgot.create({pin:"123",username:"akash"},function(err,pin){
		// 	if(err)console.log(err);
		// 	else {
		// 		console.log(pin);
		// 	}
		// });
		});
app.post("/forgotpassword",middleware,forgotpassword_middleware,function(req,res){
	
	////////////
	
		var otp=Math.floor((Math.random() * 100) + 54);
	var mailOptions = {
		
                    from: 'aroy0761@gmail.com', // sender address 
                    to: req.body.username, // list of receivers 
                    subject: 'QUIZINE OTP', // Subject line 
                    html: 'Your OTP To change password is : '+otp+' It is only valid for 5minutes'  // html body 
                };

                transporter.sendMail(mailOptions, function (err, info) {
                    if(err){console.log(err);}
					else {
						console.log(otp);
					}
              });
	
	///////////
	Forgot.findOne({username:req.body.username},function(err,olduser){
		if(err)console.log(err);
		else{
			if(!olduser){
							Forgot.create({username:req.body.username,pin:otp},function(err,user){
						if(err){console.log(err);}
						else{console.log(user);
						res.render("newpassword",{message:"",username:req.body.username});}
						
					
						
	});
			}
			else{
			Forgot.findByIdAndDelete(olduser._id,function(err){
				if(err){console.log(err);}
				else{
					Forgot.create({username:req.body.username,pin:otp},function(err,user){
						if(err){console.log(err);}
						else{console.log(user);
						res.render("newpassword",{message:"",username:req.body.username});}
						
					
						
	});
	
				}
			});
		}
		}
	});
	
});
app.post("/newpassword",middleware,function(req,res){
	
	Forgot.findOne({username:req.body.username},function(err,userpin){
		console.log("forgot.pin="+userpin.pin);
		console.log(req.body.otp);
		if(userpin.pin==req.body.otp){
			User.findOne({username:req.body.username},function(err,user){
				console.log(user);
				User.findByIdAndDelete(user._id,function(err){
			if(err){console.log(err);}
			else{
				
				
				
				var newUser=new User({username:req.body.username,name:user.name});
	User.register(newUser,req.body.password,function(err,user){
		if(err)
			{
				console.log(err);
				res.render("signup");
			}
		else{
			
			passport.authenticate("local")(req,res,function(){
				res.redirect("/dashboard");
			});
		}
	});
				
				
				
			}
		});
				
				
				
			});
		
		
		
	}
		else{
			//if pin is wrong code here
			res.render("newpassword",{message:"you entered wrong OTP",username:req.body.username});
		}
	});
});
//=========================
//MAILING ROUTES
//=========================

app.get("/credentials",function(req,res){res.redirect("/");});
app.post("/credentials",middleware,username_middleware,function(req,res){
	var otp=Math.floor((Math.random() * 100) + 54);
	var mailOptions = {
		
                    from: 'aroy0761@gmail.com', // sender address 
                    to: req.body.username, // list of receivers 
                    subject: 'QUIZINE change Password', // Subject line 
                    html: 'Your OTP for registeration is : '+otp+' It is only valid for 5minutes'  // html body 
                };

                transporter.sendMail(mailOptions, function (err, info) {
                    if(err){console.log(err);}
					else {
						console.log(otp);
						NewUser.findOne({username:req.body.username},function(err,user){
										if(err)console.log(err);
										else{
											if(!user){
										NewUser.create({username:req.body.username,otp:otp},function(err,newuser){
									   if(err){console.log(err);}
										else 
											{
						res.render("checkotp",{name:req.body.name,username:req.body.username,password:req.body.password,message:""});
											}
									   });	
												
												
											}
											else{
											
												
												
									NewUser.findByIdAndDelete(user._id,function(err){
										
										NewUser.create({username:req.body.username,otp:otp},function(err,newuser){
									   if(err){console.log(err);}
										else 
											{
						res.render("checkotp",{name:req.body.name,username:req.body.username,password:req.body.password,message:""});
											}
									   });
										
										
									});	
												
										
											}
										}
										});
						
						
					}
              });
	
	
});
app.get("/checkotp",function(req,res){res.redirect("/");});
app.post("/checkotp",middleware,function(req,res){
	NewUser.findOne({username:req.body.username},function(err,newuser){
		if(err)console.log(err);
		else{
			
				if(newuser.otp==req.body.otp){
		var newUser=new User({username:req.body.username,name:req.body.name});
	User.register(newUser,req.body.password,function(err,user){
		if(err)
			{
				console.log(err);
				res.render("signup");
			}
		else{
			
			passport.authenticate("local")(req,res,function(){
				res.redirect("/dashboard");
			});
		}
	});
		
		
		
	}
	else{
		res.render("checkotp",{name:req.body.name,username:req.body.username,password:req.body.password,message:"you entered wrong OTP"});
	}
			
			
			
		}
	});
	
});

app.get("/login",function(req,res){res.render("login");});
app.post("/login",passport.authenticate("local",{ 
	successRedirect:"/dashboard",
	failureRedirect:"/login"

}),function(req,res){
	
});

app.get("/logout",function(req,res){
	req.logout();
	res.redirect("/");
});
app.get("/dashboard",isLoggedIn,function(req,res){res.render("dashboard");});
function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
		return next();
	else res.redirect("/login");
}
function middleware(req,res,next){
	if(!req.body.username)res.redirect("/");
	else {next();}
}
function username_middleware(req,res,next){
	User.findOne({username:req.body.username},function(err,user){
		if(err){
			next();
			
		}
		else {
			if(!user)next();
			else 
			res.render("signup",{message:"username exist"});}
	});
	
}
function forgotpassword_middleware(req,res,next){
	User.findOne({username:req.body.username},function(err,user){
		if(err){
			res.render("forgotpassword",{message:"username doesn't exist"});
			
		}
		else {
			if(!user){
				res.render("forgotpassword",{message:"username doesn't exist"});
				}
			else 
				next();
		}
	});
	
}
app.listen(process.env.PORT,process.env.IP,function(){
console.log("App started");
});

// app.listen(3000,function(){
// console.log("App started");
// });