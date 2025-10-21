import mongoose from "mongoose";

const todoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, default: "General" },
  completed: { type: Boolean, default: false },
});

export default mongoose.model("Todo", todoSchema);
