import mongoose from "mongoose";

const tutorProfileSchema = new mongoose.Schema({
  accountId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
  fullName: String,
  subjectSpecialty: [String],
  experienceYears: Number,
  bio: String,
  hourlyRate: Number,
  availability: [String], // vd: ["Mon 9-11", "Wed 14-16"]
}, { timestamps: true });

const TutorProfile = mongoose.model("tutorprofiles", tutorProfileSchema);
export default TutorProfile;
