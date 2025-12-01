import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
  slug:{
  type:String
  },
  title: {
    type: String,
  },
  content: {
    type: String,
  },
  image: {
    type: String,
  },
  imgId:{
    type:String
  },
  isPublished:{
  type:Boolean
  },
  createdAt: {
    type: String,
  },
  publishedAt: {
    type: String,
  },
});

// module.exports =

export default mongoose.models.News || mongoose.model("News", blogSchema);
