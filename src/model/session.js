// src/model/session.js
import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  studentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Account", 
    required: true, 
    index: true 
  },
  tutorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Account", 
    required: true, 
    index: true 
  },
  subject: { 
    type: String, 
    required: true 
  },
  startTime: { 
    type: Date, 
    required: true, 
    index: true 
  },
  endTime: { 
    type: Date, 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["PENDING","ACCEPTED","REJECTED","CANCELLED","DONE"], 
    default: "PENDING", 
    index: true 
  },
  meetingLink: { 
    type: String, 
    default: "" 
  },
  tutorNotes: { 
    type: String, 
    default: "" 
  },
}, { timestamps: true });

// ĐẢM BẢO EXPORT ĐÚNG
const Session = mongoose.model("Session", SessionSchema);
export default Session;