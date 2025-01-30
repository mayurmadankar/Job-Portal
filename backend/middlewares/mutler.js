// import multer from "multer";

// const storage = multer.memoryStorage();
// export const singleUpload = multer({ storage ,}).single("file");

import multer from "multer";
import path from "path";

// Storage configuration
const storage = multer.memoryStorage();

// File filter for images (only allow image files)
const imageFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};

// File filter for resumes (only allow PDF files)
const resumeFileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".pdf") {
    return cb(new Error("Only PDF files are allowed!"), false);
  }
  cb(null, true);
};

// Middleware for uploading images
export const imgUpload = multer({
  storage,
  fileFilter: imageFileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // Limit image file size to 5MB
}).single("img"); // Field name for image upload

// Middleware for uploading resumes
export const resumeUpload = multer({
  storage,
  fileFilter: resumeFileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // Limit resume file size to 10MB
}).single("resume"); // Field name for resume upload
