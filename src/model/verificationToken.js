// src/model/verificationToken.js
import mongoose from "mongoose";

const verificationTokenSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Account", 
    required: true 
  },
  token: { 
    type: String, 
    required: true,
    index: true 
  },
  expiresAt: { 
    type: Date, 
    required: true,
    index: true,
    expires: 86400 // 24 hours
  }
}, { timestamps: true });

export default mongoose.model("VerificationToken", verificationTokenSchema);