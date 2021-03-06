var mongoose=require("mongoose");
var ContestQuestionSchema=new mongoose.Schema({
	question:String,optionA:String,optionB:String,optionC:String,optionD:String,answer:String
});


/////////////////////////////////////////////////////////////
var PastContestSchema=new mongoose.Schema({
	contest_id:String,
	contest_name:String,
	username:String,
	start_date:String,
	start_time:String,
	end_date:String,
	end_time:String,
	details:String,
	contest_questions:[ContestQuestionSchema]
	
	});
module.exports= mongoose.model("PastContest",PastContestSchema);
