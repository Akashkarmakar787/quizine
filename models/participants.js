var mongoose=require("mongoose"); 
var ParticipantSchema=new mongoose.Schema({
	pname:String,rank:String,score:String
});
module.exports=mongoose.model("Participant",ParticipantSchema);