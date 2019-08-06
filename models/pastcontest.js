var mongoose=require("mongoose");
var ContestQuestionSchema=new mongoose.Schema({
	question:String,optionA:String,optionB:String,optionC:String,optionD:String,answer:String
});


/////////////////////////////////////////////////////////////
var PastContestSchema=new mongoose.Schema({
	
	contest_name:String,
	contest_questions:[ContestQuestionSchema]
	
	});
module.exports= mongoose.model("PastContest",PastContestSchema);
