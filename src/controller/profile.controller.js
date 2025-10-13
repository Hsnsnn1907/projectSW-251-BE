import Account from "../model/account.js";
import TutorProfile from "../model/tutor.js";
import StudentProfile from "../model/students.js";

export async function updateProfile(req, res) {
  const { fullName, subjectSpecialty, experienceYears, bio, hourlyRate, availability, grade, schoolName } = req.body || {};
  const userId = req.user.sub;
  const userRole = req.user.role;

  try {
    // Cập nhật thông tin dựa trên role
    if (userRole === "TUTOR") {
      await TutorProfile.findOneAndUpdate(
        { accountId: userId },
        { 
          fullName,
          subjectSpecialty: subjectSpecialty || [],
          experienceYears,
          bio,
          hourlyRate,
          availability: availability || []
        },
        { upsert: true, new: true }
      );
    } else if (userRole === "STUDENT") {
      await StudentProfile.findOneAndUpdate(
        { accountId: userId },
        { 
          fullName,
          grade,
          schoolName,
          // Giữ nguyên các trường khác nếu không gửi lên
        },
        { upsert: true, new: true }
      );
    }

    return res.json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Update profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getProfile(req, res) {
  const userId = req.user.sub;
  const userRole = req.user.role;

  try {
    let profile = null;
    
    if (userRole === "TUTOR") {
      profile = await TutorProfile.findOne({ accountId: userId }).lean();
    } else if (userRole === "STUDENT") {
      profile = await StudentProfile.findOne({ accountId: userId }).lean();
    }

    // Lấy thông tin email từ Account
    const account = await Account.findById(userId).select("email").lean();
    
    return res.json({
      profile: {
        ...profile,
        email: account?.email,
        role: userRole
      }
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}