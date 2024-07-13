import applicationModel from "../../../db/models/application.model.js";
import companyModel from "../../../db/models/company.model.js";
import jobModel from "../../../db/models/job.model.js";
import userModel from "../../../db/models/user.model.js";
import { AppError } from "../../../utils/classError.js";
import { systemRoles } from "../../../utils/commen/enum.js";
import { asyncHandler } from "../../../utils/globalErrorHandler.js";

//add company role Company_HR can add only
//requiers token in headers and company data in body

export const addCompany = asyncHandler(async(req,res,next)=>{
    const {
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        companyHR,
    } = req.body;
    const companyHRExist = await userModel.findOne({_id:companyHR,role:systemRoles.COMPANY_HR})
    if(!companyHRExist){
        return next(new AppError("company HR not found", 409));
    }

    //check if company HR already exists in other company
    const companyHr = await companyModel.findOne({companyHR})
    if(companyHr){
        return next(new AppError("company HR already exists", 409));
    }

    //check if other company uses same name or email
    const companyExist = await companyModel.findOne({$or:[{companyName},{companyEmail}]})
    if(companyExist){
        return next(new AppError("company already exists", 409));
    }
   
    const company = await companyModel.create({
        companyName,
        description,
        industry,
        address,
        numberOfEmployees,
        companyEmail,
        companyHR,
    });

    return res.status(200).json({ msg: "company added successfully",company });
})

//================================================================

//update company
export const updateCompany = asyncHandler(async(req,res,next)=>{
  const companyExist = await companyModel.findOne({
    _id: req.params.companyId,
  });
  if (!companyExist) {
    return next(new AppError("company not exist!", 404));
  }

  //only company_HR can update data
  const companyHr = await companyModel.findOne({
    _id: req.params.companyId,
    companyHR: req.user._id,
  });
  if (!companyHr) {
    return next(new AppError("you are not authurized to update!", 409));
  }
  
  //check if other company uses same updated name or email
  const updatedCompanyExist = await companyModel
    .findOne({
      $or: [
        { companyName: req.body.companyName },
        { companyEmail: req.body.companyEmail },
      ],
    })
    .nor({ _id: req.params.companyId });
  if (updatedCompanyExist) {
    return next(new AppError("can't update company already exists", 409));
  }

  //if company wants to update company_HR check if updated HR exists
  if (req.body.companyHR) {
    const user = await userModel.findOne({
      _id: req.body.companyHR,
      role: systemRoles.COMPANY_HR,
    });
    if (!user) {
      return next(new AppError("company HR not found", 409));
    }
  }
  //if all conditions verified then update
  const company = await companyModel.findByIdAndUpdate(
    { _id: req.params.companyId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!company) {
    return next(new AppError("company not exist", 404));
  }
  return res.status(200).json({ msg: "company updated successfully", company });
})

//======================================================================

//delete company
export const deleteCompany = asyncHandler(async(req,res,next)=>{
    const companyHr = await companyModel.findOne({ _id: req.params.companyId,companyHR:req.user._id });
    if (!companyHr) {
        return next(new AppError("you are not authurized to delete!", 409));
    }
    const company = await companyModel.findByIdAndDelete({_id:req.params.companyId});
    if (!company) {
        return next(new AppError("company not exist", 404));
    }
  return res.status(200).json({ msg: "company deleted successfully" });
})

//================================================================

//Get company data by id
export const getCompany = asyncHandler(async(req, res, next) => {
    const company = await companyModel
      .findById(req.params.companyId)
      .populate("companyHR", "firstName lastName email ");
    if (!company) {
        return next(new AppError("company not exist", 404));
    }
    const companyJobs = await jobModel.find({ company: req.params.companyId });
  return res.status(200).json({ msg: "done", company, jobs:companyJobs });
})

//================================================================

//get company by name
export const getCompanyByName = asyncHandler(async(req, res, next) => {
    const company = await companyModel
      .findOne({ companyName: req.query.name })
      .populate("companyHR", "firstName lastName email ");;
    if (!company) {
        return next(new AppError("company not exist", 404));
    }
    
  return res.status(200).json({ msg: "done", company });
})

//================================================================

//Get all applications for specific Job
export const getApplicationsByJob = asyncHandler(async(req, res, next) => {
    const job = await jobModel.findById(req.query.jobId);
    if (!job) {
        return next(new AppError("job not exist", 404));
    }
    const companyHR = await jobModel.findOne({addedBy:req.user._id})
    if (!companyHR) {
        return next(new AppError("you are not authurized!", 409));
    }

    const applications = await applicationModel
      .find({ jobId: req.query.jobId })
      .populate(
        "user",
        "firstName lastName email technicalSkills softSkills"
      );

  return res.status(200).json({ msg: "done", applications });
})