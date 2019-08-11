var mongoose=require("mongoose"); 
var contestantSchema=new mongoose.Schema({
	username:String,score:String
});

var ParticipantSchema= new mongoose.Schema({
	
	contest_id:String,
	contestant:[contestantSchema]
});
module.exports=mongoose.model("Participant",ParticipantSchema);