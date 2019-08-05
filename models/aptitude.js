var mongoose=require("mongoose");
var AptitudeSchema=new mongoose.Schema({
	question:String,optionA:String,optionB:String,optionC:String,optionD:String,answer:String
});
module.exports=mongoose.model("Aptitude",AptitudeSchema);