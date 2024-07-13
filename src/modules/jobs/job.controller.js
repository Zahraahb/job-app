import jobModel from "../../../db/models/job.model.js";
import { AppError } from "../../../utils/classError.js";
import { asyncHandler } from "../../../utils/globalErrorHandler.js";
import applicationModel from "../../../db/models/application.model.js";
import companyModel from "../../../db/models/company.model.js";

//add job
//token requiered
export const addJob = asyncHandler( async (req,res,next) => {
   const company = await companyModel.findOne({companyHR:req.user._id})
   if(!company){
       return next(new AppError("no company with such HR!", 409));
   }
   const job = await jobModel.create({...req.body, addedBy:req.user._id, company:company._id});
   return res.status(200).json({ msg: "job added successfully", job });

})

//================================================================

//update job
//token requiered
export const updateJob = asyncHandler(async (req, res, next) => {

   const sameCompanyHR = await jobModel.findOne({
     addedBy: req.user._id,
     _id: req.params.jobId,
   });
   if(!sameCompanyHR){
     return next(new AppError("company HR only can update!", 409));
   }
   
   const job = await jobModel.findByIdAndUpdate(req.params.jobId, req.body, { new: true });
   if (!job) {
       return next(new AppError("job not exist", 404));
   }
   return res.status(200).json({ msg: "job updated successfully", job });

})

//================================================================

//delete job
//token requiered
export const deleteJob = asyncHandler(async (req, res, next) => {
  const sameCompanyHR = await jobModel.findOne({
    addedBy: req.user._id,
    _id: req.params.jobId,
  });
  if (!sameCompanyHR) {
    return next(new AppError("company HR only can delete!", 409));
  }

  const job = await jobModel.findByIdAndDelete({ _id: req.params.jobId });
  if (!job) {
    return next(new AppError("job not exist", 404));
  }
  //delete Job Applications
  await applicationModel.deleteMany({ jobId: req.params.jobId });

  return res.status(200).json({ msg: "job deleted successfully" });
})

//================================================================

//Get all Jobs with their company’s information.
//token requiered
export const getAllJobs = asyncHandler(async (req, res, next) => {
  const jobs = await jobModel.find().populate("company");
  return res.status(200).json({ msg: "done", jobs });
})

//================================================================

//Get all Jobs with their company’s information for a specific company by company name.
//token requiered
export const getCompanyJobs = asyncHandler(async (req, res, next) => {
  const company = await companyModel.findOne({
    companyName: req.query.name,
  });
  if (!company) {
    return next(new AppError("company not found", 404));
  }

  const jobs = await jobModel.find({ company: company._id }).populate("company");
  return res.status(200).json({ msg: "done", jobs });
})

//================================================================

//  Get all Jobs with filters
//token requiered
export const jobWithFilters = asyncHandler(async(req, res, next) => {
  const {
    workingTime,
    jobLocation,
    seniorityLevel,
    jobTitle,
    technicalSkills,
  } = req.query;
  const query = {};

  if (workingTime) query.workingTime = workingTime;
  if (jobLocation) query.jobLocation = jobLocation;
  if (seniorityLevel) query.seniorityLevel = seniorityLevel;
  if (jobTitle) query.jobTitle = new RegExp(jobTitle, "i"); // case insensitive searche
  if (technicalSkills)
    query.technicalSkills = {
      $in: technicalSkills.split(",").map((ele) => new RegExp(ele, "i"))// with case insensitive searche,
    };

  const jobs = await jobModel.find(query).populate("company");
  if (!jobs.length) {
    return next(new AppError("no jobs found!", 404));
  }
  return res.status(200).json({ msg: "done", jobs });
})

//================================================================

//Apply to Job

export const applyJob = asyncHandler(async (req, res, next) => {
    const job = await jobModel.findById(req.params.jobId);
    if (!job) {
      return next(new AppError("job not found", 404));
    }
    jobId = job._id;
    const { userTechSkills, userSoftSkills } = req.body;
    if (!req.file) {
      next(new AppError("resume not found!", 409));
    }
    

    const userAlreadyApplied = await applicationModel.findOne({
      userId: req.user._id,
      jobId: req.params.jobId,
    });
    if(userAlreadyApplied){
        return next(new AppError("you already applied for this job!", 409));
    }
    const application = await applicationModel.create({
      userId: req.user._id,
      jobId: req.params.jobId,
      userTechSkills,
      userSoftSkills,
      userResume: req.file.path,
    });

    return res.status(200).json({ msg: "applied successfully", application });
})