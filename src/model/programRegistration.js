// src/model/programRegistration.js
import mongoose from "mongoose";

const ProgramRegistrationSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true, index: true },
  programName: { type: String, required: true },
  notes: { type: String, default: "" },
}, { timestamps: true });

export default mongoose.model("ProgramRegistration", ProgramRegistrationSchema);
