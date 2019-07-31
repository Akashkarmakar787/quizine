var express=require("express");
var app=express();
var nodemailer = require('nodemailer');
app.set("view engine","ejs");

var bodyparser=require("body-parser");
app.use(bodyparser.urlencoded({extended:false}));
//=========================
//MAILING ROUTES
//=========================

                // create reusable transporter object using SMTP transport 
                var transporter = nodemailer.createTransport({
                    service: 'Gmail',
                    auth: {
                        user: 'aroy0761@gmail.com',
                        pass: 'sayankarmakar'
                    }
                });
app.get("/signup",function(req,res){
	res.render("signup");
});
app.post("/credentials",function(req,res){
	var otp=Math.floor((Math.random() * 100) + 54);
	var mailOptions = {
		
                    from: 'aroy0761@gmail.com', // sender address 
                    to: req.body.email, // list of receivers 
                    subject: 'QUIZINE OTP', // Subject line 
                    html: 'Your one time password is : '+otp  // html body 
                };

                transporter.sendMail(mailOptions, function (err, info) {
                    if(err){console.log(err);}
					else {
						
						console.log(otp);
						res.render("checkotp",{otp:otp});
					}
              });
	
	
});
app.post("/checkotp",function(req,res){
	if(req.body.actualotp==req.body.otp){
		res.send("you did it");
	}
    else{
		res.render("checkotp",{otp:req.body.actualotp});
	}
});
app.get("/",function(req,res){res.render("index");});
app.listen(process.env.PORT,process.env.IP,function(){
console.log("App started");
});