// src/controller/tutor.controller.js

import session from "../model/session";

// GET /tutor/sessions/pending
export async function listPending(req, res) {
  const sessions = await session.find({
    tutorId: req.user.sub,
    status: "PENDING",
  }).lean();
  return res.json({ sessions });
}

// PATCH /tutor/sessions/:id/confirm
export async function confirmSession(req, res) {
  const { id } = req.params;
  const { action, meetingLink } = req.body || {}; // action = "ACCEPT" | "REJECT"
  const s = await session.findById(id);
  if (!s) return res.status(404).json({ message: "Session not found" });
  if (String(s.tutorId) !== String(req.user.sub)) {
    return res.status(403).json({ message: "Forbidden" });
  }
  if (s.status !== "PENDING") {
    return res.status(409).json({ message: "Session already handled" });
  }

  if (action === "ACCEPT") {
    s.status = "ACCEPTED";
    if (meetingLink) s.meetingLink = meetingLink;
  } else if (action === "REJECT") {
    s.status = "REJECTED";
  } else {
    return res.status(400).json({ message: "Invalid action" });
  }

  await s.save();
  return res.json({ message: "Updated", status: s.status });
}
