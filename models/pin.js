var mongoose=require("mongoose");
var ForgotSchema=new mongoose.Schema({
	username:String,pin:String,
	expire_at: {type: Date, default: Date.now, expires: 300} 
});
module.exports=mongoose.model("pin",ForgotSchema);