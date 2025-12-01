import mongoose from "mongoose";

const posterSchema = new mongoose.Schema({
  
  image: {
    type: String,
  },
  imgId:{
    type:String
  },
  timeStamp:{
    type:String
  } 
   
});

// module.exports =

export default mongoose.models.Poster || mongoose.model("Poster", posterSchema);
