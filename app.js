var express					=require("express");
var md5						=require("md5");
var User					=require("./models/user");
var Forgot					=require("./models/pin");
var Admin					=require("./models/admin");
var NewUser					=require("./models/newuserpin");
var Aptitude				=require("./models/aptitude");
var PastContest				=require("./models/pastcontest");
var ContestRequest			=require("./models/contestrequest");
var FutureContest			=require("./models/futurecontest");
var mongoose 				=require("mongoose");
var passport				=require("passport");
var LocalStrategy			=require("passport-local");
var nodemailer 				=require('nodemailer');
var bodyparser				=require("body-parser");
var request					=require("request");
var app=express();

// to see the website visit https://shrouded-ridge-73828.herokuapp.com
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
				if(err){console.log(err);res.redirect("/");}
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
			if(err){console.log(err);res.redirect("/"); }
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
										         if(err){console.log(err);res.redirect("/");}
										NewUser.create({username:req.body.username,otp:otp},function(err,newuser){
									   if(err){console.log(err);res.redirect("/");}
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

//=======================================
//			ADMIN ROUTES
//=======================================
app.get("/admin/signup",function(req,res){
	res.render("./admin/signup",{message:"",wrongsecretcode:""});
});
app.post("/admin/signup",admin_middleware,function(req,res){
	if(req.body.secretkey=="chankarsaa")
		{
			
			var newAdmin=new Admin({username:req.body.username,name:req.body.name});
	Admin.register(newAdmin,req.body.password,function(err,admin){
		if(err)
			{
				console.log(err);
				res.render("admin/signup",{message:"",wrongsecretcode:""});
			}
		else{
			
			passport.authenticate("local")(req,res,function(){
				res.redirect("/admin/dashboard");
			});
		}
	});
			
		}
	else{
		res.render("admin/signup",{message:"",wrongsecretcode:"You entered wrong secretcode"});
	}
	
});
app.get("/admin/dashboard",isAdminLoggedIn,function(req,res,next){
		res.render("admin/dashboard");
		});


app.get("/admin/login",function(req,res){
	res.render("./admin/login");
});
app.post("/admin/login",passport.authenticate("local",{ 
	successRedirect:"/admin/dashboard",
	failureRedirect:"/admin/login"
}),function(req,res){
});
app.get("/admin/contestrequests",isAdminLoggedIn,function(req,res){
	ContestRequest.find({},function(err,contestrequests){
		if(err)console.log(err);
		else{
			res.render("admin/contestrequests",{contestrequests:contestrequests});
		}
	});
});
app.get("/admin/validate/contest/:id",isAdminLoggedIn,function(req,res){
	ContestRequest.findById(req.params.id,function(err,request){
		if(err){console.log(err);res.redirect("/admin/contestrequests");}
		else{
			FutureContest.create({contest_name:request.contest_name,start_date:request.start_date,start_time:request.start_time,end_date:request.end_date,end_time:request.end_time,details:request.details,username:request.username},function(err,futurecontest){
				if(err)console.log(err);
				else{
					console.log(futurecontest);
					ContestRequest.findByIdAndDelete(req.params.id,function(err){
						if(err){console.log(err);res.redirect("/admin/dashboard");}
					});
					var mailOptions = {
		
                    from: 'aroy0761@gmail.com', // sender address 
                    to: futurecontest.username, // list of receivers 
                    subject: 'Contest Hosting', // Subject line 
                    html: 'Go to the link and add questions for the contest. Your contest will start on the date and time you have provided.Do not share this link with any one. Link: https://goorm-ide-test-mhaxq.run.goorm.io/useradmin/'+futurecontest._id+'/'+futurecontest.username  // html body 
                };

                transporter.sendMail(mailOptions, function (err, info) {
                    if(err){console.log(err);}
					else {
						res.redirect("/admin/contestrequests");
						
					}});
	
					
					
					
					
					/////////////
					
				}
			});
		}
	});
});
app.get("/admin/delete/contest/:id",isAdminLoggedIn,function(req,res){
	ContestRequest.findByIdAndDelete(req.params.id,function(err){if(err){console.log(err);res.redirect("/admin/delete");}
																
																else res.redirect("/admin/contestrequests");});
	
});
//===============================
//	QUESTIONS ROUTES
//===============================	
app.get("/admin/aptitude",isAdminLoggedIn,function(req,res){
	res.render("questions/aptitude",{message:""});
});
app.post("/admin/aptitude",isAdminLoggedIn,function(req,res){
	Aptitude.create({question:req.body.question,optionA:req.body.optionA, optionB:req.body.optionB, optionC:req.body.optionC, optionD:req.body.optionD,answer:req.body.answer},function(err,question){
		if(err){console.log(err);res.render("questions/aptitude",{message:""});}
		else {console.log("Aptitude Question Added");res.render("questions/aptitude",{message:"question added"});}
	});
});
//=============================
//		SOLVE QUESTIONS
//=============================
app.get("/solve/aptitude",isLoggedIn,function(req,res){
	Aptitude.find({},function(err,allquestions){
		if(err){console.log(err);}
		else{
	        res.render("solve/solveaptitude",{questions:allquestions});		
		}
	});
});
app.get("/solve/more",isLoggedIn,function(req,res){
	res.render("solve/more",{message:""});
});
app.post("/solve/more",isLoggedIn,function(req,res){
	var link="https://opentdb.com/api.php?amount=5"+"&category="+req.body.category+"&difficulty="+req.body.difficulty+"&type=multiple";

	request(link,function(error,response,body){

	if(!error&&response.statusCode==200)
		{   
			var parseData=JSON.parse(body);
			if(parseData.response_code!="0"){res.render("solve/more",{message:"some unexpected error occured"});}
			else{
				var quiz=[];
				var i=0;
				var category;
				var difficulty;
			parseData.results.forEach(function(data){
				var answers=[];
				answers.push(data.incorrect_answers[0]);
				answers.push(data.incorrect_answers[1]);
				answers.push(data.incorrect_answers[2]);
				answers.push(data.correct_answer);
				for(var j=0;j<4;j++)
					{
						var r=Math.floor(Math.random() * (3 - 0 + 1)) + 0;
						var t=answers[0];
						answers[0]=answers[r];
						answers[r]=t;
					}
				category=data.category;
				difficulty=data.difficulty;
				    quiz.push({"question":data.question,"answers":{"0":answers[0], "1":answers[1], "2":answers[2], "3":answers[3]},"correct_answer":data.correct_answer,"id":Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10)+Math.random().toString(36).replace(/[^a-z]+/g, '').substr(2, 10)});
						
							i++;
				console.log(data);
										 });
				res.render("solve/solvemore",{quiz:quiz,category:category,difficulty:difficulty});
			}
		  
		}
});
	
});

app.get("/solve/pastcontest/",isLoggedIn,function(req,res){
	// PastContest.create({contest_name:"aptitude_contest"},function(err,pastcontest){
	// 	if(err)console.log(err);
	// 	else{
	// 		pastcontest.contest_questions.push({question:"this is my 1st past contest question",optionA:"A",optionB:"B",optionC:"C" ,optionD:"D",answer:"B"});
			
	// 		pastcontest.contest_questions.push({question:"this is my 2st past contest question",optionA:"wrong",optionB:"wrong",optionC:"wrong" ,optionD:"correct",answer:"D"});
			
	// 		pastcontest.contest_questions.push({question:"this is my 3st past contest question",optionA:"1",optionB:"2",optionC:"3" ,optionD:"4",answer:"A"});
	// 		pastcontest.save(function(err,pastcontest){
	// 			if(err)console.log(err);
	// 			else {
	// 				console.log(pastcontest);
	// 			}
	// 		});
	// 	}
	// });
	
	
	PastContest.find({},function(err,pastcontest){
		if(err){console.log(err);}
		else
			{  var contest_name_id=[];
			 	
			   pastcontest.forEach(function(contest){contest_name_id.push({"id":contest._id,"name":contest.contest_name});});
				res.render("solve/pastcontest",{Contest:contest_name_id});
			}
	});
	
});
app.get("/solve/pastcontest/:id",isLoggedIn,function(req,res){
	PastContest.findById(req.params.id,function(err,pastcontest){
		if(err){console.log(err);res.redirect("/dashboard");}
		else{console.log(pastcontest);
			res.render("solve/solvepastcontest",{pastcontest:pastcontest});
			}
		
	});
});
//==================================
//	USERADMIN ROUTES
//==================================
app.get("/useradmin/hostcontest/:username",isLoggedIn,function(req,res){
	ContestRequest.findOne({username:req.params.username},function(err,user){
		if(err)console.log(err);
		else
			{
				if(!user)
					{
						FutureContest.findOne({username:req.params.username},function(err,futurecontest){
							if(err)console.log(err);
							else
								{
									if(!futurecontest){res.render("useradmin/contestdetails");}
									else{
										contest={contest_name:futurecontest.name,start_date:futurecontest.start_date,
												end_date:futurecontest.end_date,start_time:futurecontest.start_time
												,end_time:futurecontest.end_time,details:futurecontest.details}
										res.render("useradmin/appliedcontest",{contest:contest});
									}
								}
						});
						
					}
				else{
				         res.render("useradmin/appliedcontest",{contest:user});	
				}
					
			}
	});
	
});
app.post("/useradmin/hostcontest",isLoggedIn,function(req,res){
	console.log();
	ContestRequest.findOne({username:req.body.username},function(err,user){
		if(err)console.log(err);
		else{
			if(!user){
				ContestRequest.create({start_date:req.body.sdate,end_date:req.body.edate,start_time:req.body.stime,end_time:req.body.etime, username:req.body.username, contest_name:req.body.contestname,details:req.body.details},function(err,contest){
					if(err)console.log(err);
					else{
						console.log(contest);
						res.redirect("/useradmin/hostcontest/"+contest.username);
						//res.render("useradmin/appliedcontest",{contest:contest});
					}
				});
				
			}
			else
				{
					res.render("useradmin/appliedcontest",{contest:user});
				}
		}
	});
	
});
app.get("/useradmin/:id/:username",function(req,res){
	FutureContest.findById(req.params.id,function(err,futurecontest){
		if(err){console.log(err);res.redirect("/");}
		else{ console.log(futurecontest);
			  if(futurecontest.__v==0)
				  {
					  res.render("useradmin/noofquestions",{id:req.params.id});
				  }
			  else{
				  res.send("Your questions are save if you want any change or update contact Admins");
			  }
		}
	});
});
app.post("/useradmin/contest/:id",function(req,res){
	FutureContest.findById(req.params.id,function(err,futurecontest){
		if(err){console.log(err);res.redirect("/");}
		else{
			if(futurecontest.__v==0)
				{
					res.render("useradmin/addquestion",{id:req.params.id,n:req.body.number});
				}
			 else{
				  res.send("Your questions are saved if you want any change or update contact Admins");
			  }
		}
	});
});
app.post("/useradmin/addquestion/:id/:n",function(req,res){
	FutureContest.findById(req.params.id,function(err,futurecontest){
		if(err){console.log(err);res.redirect("/");}
		else{
			if(futurecontest.__v==0)
				{
					for(var i=1;i<=parseInt(req.params.n);i++)
						{
	                       var v="question"+(i.toString());
							console.log("hello world");
							console.log(v);
	 		futurecontest.contest_questions.push({question:req.body['question'+i.toString()],optionA:req.body['optionA'+i.toString()],optionB:req.body['optionB'+i.toString()],optionC:req.body['optionC'+i.toString()],optionD:req.body['optionD'+i.toString()],answer:req.body['answer'+i.toString()]});
					
// 					FutureContest.contest_questions.push({question:"this is my 2st past contest question",optionA:"wrong",optionB:"wrong",optionC:"wrong" ,optionD:"correct",answer:"D"});
	 				futurecontest.save(function(err,fc){
	 					if(err)console.log(err);
	 					else {
	 						console.log(fc);
	 							}
	 						});							
						}
					res.send("Successfully Saved");
				}
			else{
				 res.send("Your questions are saved if you want any change or update contact Admins");
			}
		   }
	});
	
});
//=============================
//	MIDDLEWARE FUNCTIONS
//=============================
function isLoggedIn(req,res,next){
	if(req.isAuthenticated())
	{
		return next();}
	else {res.redirect("/login");}
}
function isAdminLoggedIn(req,res,next){
	if(req.isAuthenticated())
	{  
		if(req.user._id=="5d4578f878fbdc40f9a41a38")
		return next();
	    else res.redirect("/admin/login");
	}
	
	else res.redirect("/admin/login");
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
function admin_middleware(req,res,next){
	Admin.findOne({username:req.body.username},function(err,user){
		if(err){
			next();
			
		}
		else {
			if(!user)next();
			else 
			res.render("admin/signup",{message:"username exist",wrongsecretcode:""});}
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

// app.listen(process.env.PORT,process.env.IP,function(){
// console.log("App started");
// });

app.listen(3000,function(){
console.log("App started");
});