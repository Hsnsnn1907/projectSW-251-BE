// src/model/feedback.js
import mongoose from "mongoose";

const FeedbackSchema = new mongoose.Schema({
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true, index: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
  tutorId:   { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
  rating:    { type: Number, min: 1, max: 5, required: true },
  comment:   { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("Feedback", FeedbackSchema);
