var mongoose=require("mongoose");
var NewUserSchema=new mongoose.Schema({
	username:String,otp:String,
	expire_at: {type: Date, default: Date.now, expires: 300} 
});
module.exports=mongoose.model("newuserotp",NewUserSchema);