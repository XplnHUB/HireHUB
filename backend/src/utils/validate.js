export const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!id || !/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }
  next();
};
export const validateStudentData = (req, res, next) => {
  const { name, email, passwordHash } = req.body;
  if (!name || !email || !passwordHash) {
    return res.status(400).json({ message: "Name, email, and password are required" });
  }
  next();
};
export const validateRecruiterData = (req, res, next) => {
  const { name, email, passwordHash, companyName } = req.body;
  if (!name || !email || !passwordHash || !companyName) {
    return res.status(400).json({ message: "Name, email, password, and company name are required" });
  }
  next();
};
export const validateJobData = (req, res, next) => {
  const { recruiterId, title, description } = req.body;
  if (!recruiterId || !title || !description) {
    return res.status(400).json({ message: "Recruiter ID, title, and description are required" });
  }
  next();
};
export const validateApplicationData = (req, res, next) => {
  const { studentId, jobId } = req.body;
  if (!studentId || !jobId) {
    return res.status(400).json({ message: "Student ID and Job ID are required" });
  }
  next();
};
export const validateInterviewData = (req, res, next) => {
  const { applicationId, interviewDate } = req.body;
  if (!applicationId || !interviewDate) {
    return res.status(400).json({ message: "Application ID and Interview Date are required" });
  }
  next();
};
export const validateSkillData = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ message: "Skill name is required" });
  }
  next();
};
export const validateCodingProfileData = (req, res, next) => {
  const { studentId, platformName, username } = req.body;
  if (!studentId || !platformName || !username) {
    return res.status(400).json({ message: "Student ID, Platform Name, and Username are required" });
  }
  next();
};
export const validateNotificationData = (req, res, next) => {
  const { studentId, message } = req.body;
  if (!studentId || !message) {
    return res.status(400).json({ message: "Student ID and message are required" });
  }
  next();
};
