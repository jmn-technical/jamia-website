import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  password: {
    type: String,
  },
});

// module.exports =

export default mongoose.models.Auth ||
  mongoose.model("Auth", authSchema);
