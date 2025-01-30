import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { sendApplicationEmail } from "../service/mailer.js";

export const applyJob = async (req, res) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;
    const email = req.email;
    const resumeFile = req.file;

    if (!jobId) {
      return res.status(400).json({
        message: "Job id is required.",
        success: false
      });
    }
    // check if the user has already applied for the job
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId
    });

    if (existingApplication) {
      return res.status(400).json({
        message: "You have already applied for this jobs",
        success: false
      });
    }

    // check if the jobs exists
    const job = await Job.findById(jobId).populate("company");
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false
      });
    }

    // Upload the resume to Cloudinary
    let resumeUrl = "";
    if (resumeFile) {
      const result = await cloudinary.uploader.upload_stream(
        { resource_type: "raw" }, // Use raw for non-image files like PDF
        (error, result) => {
          if (error) {
            console.log("Cloudinary upload error:", error);
            return res.status(500).json({
              message: "Failed to upload resume",
              success: false
            });
          }
          resumeUrl = result.secure_url; // Get the Cloudinary URL of the uploaded resume
        }
      );
      resumeFile.stream.pipe(result);
    }

    // create a new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId
    });

    job.applications.push(newApplication._id);
    await job.save();

    // Get the company name from the populated company field
    const companyName = job.company ? job.company.name : "Unknown Company";

    //send email notification
    const jobTitle = job.title;
    await sendApplicationEmail(email, jobTitle, companyName);

    return res.status(201).json({
      message: "Job applied successfully.",
      success: true
    });
  } catch (error) {
    console.log(error);
  }
};
export const getAppliedJobs = async (req, res) => {
  try {
    const userId = req.id;
    const application = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        options: { sort: { createdAt: -1 } },
        populate: {
          path: "company",
          options: { sort: { createdAt: -1 } }
        }
      });
    if (!application) {
      return res.status(404).json({
        message: "No Applications",
        success: false
      });
    }
    return res.status(200).json({
      application,
      success: true
    });
  } catch (error) {
    console.log(error);
  }
};
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req, res) => {
  try {
    const jobId = req.params.id;
    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant"
      }
    });
    if (!job) {
      return res.status(404).json({
        message: "Job not found.",
        success: false
      });
    }
    return res.status(200).json({
      job,
      succees: true
    });
  } catch (error) {
    console.log(error);
  }
};
export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.id;
    if (!status) {
      return res.status(400).json({
        message: "status is required",
        success: false
      });
    }

    // find the application by applicantion id
    const application = await Application.findOne({ _id: applicationId });
    if (!application) {
      return res.status(404).json({
        message: "Application not found.",
        success: false
      });
    }

    // update the status
    application.status = status.toLowerCase();
    await application.save();

    return res.status(200).json({
      message: "Status updated successfully.",
      success: true
    });
  } catch (error) {
    console.log(error);
  }
};
