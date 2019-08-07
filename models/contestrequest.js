var mongoose=require("mongoose");
var ContestRequestSchema=new mongoose.Schema({
	contest_name:String,
	username:String,
	start_date:String,
	start_time:String,
	end_date:String,
	end_time:String,
	details:String
});
module.exports=mongoose.model("ContestRequest",ContestRequestSchema);