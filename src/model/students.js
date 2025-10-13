import mongoose from "mongoose";

const studentProfileSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
  fullName: String,
  grade: String,
  schoolName: String,
  enrolledTutors: [{ type: mongoose.Schema.Types.ObjectId, ref: "TutorProfile" }],
  progress: {
    math: Number,
    physics: Number,
    chemistry: Number,
  },
}, { timestamps: true });

const StudentProfile = mongoose.model("StudentProfile", studentProfileSchema);
export default StudentProfile;
