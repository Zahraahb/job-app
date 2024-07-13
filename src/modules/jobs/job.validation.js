import joi from "joi";
import { location, seniorityLevel, systemRoles, workingTime } from "../../../utils/commen/enum.js";
import { generalFieldes } from "../../../utils/commen/generalFields.js";
import { objectIdValidation } from "../../../utils/commen/generalValidation.js";


export const addJobValidation = {
  body: joi.object({
    jobTitle: joi.string().required(),
    jobDescription: joi.string().required(),
    jobLocation: joi
      .string()
      .required()
      .valid(...Object.values(location)),
    company: joi.string().custom(objectIdValidation),
    seniorityLevel: joi
      .string()
      .required()
      .valid(...Object.values(seniorityLevel)),
    softSkills: joi.array().items(joi.string()).required(),
    technicalSkills: joi.array().items(joi.string()).required(),
    workingTime: joi
      .string()
      .required()
      .valid(...Object.values(workingTime)),
    addedBy: joi.string().custom(objectIdValidation),
    company: joi.string().custom(objectIdValidation),
  }),
  headers: generalFieldes.headers,
};

export const updateJobValidation = {
    body: joi.object({
        jobTitle: joi.string(),
        jobDescription: joi.string(),
        jobLocation: joi.string().valid(...Object.values(location)),
        seniorityLevel: joi.string().valid(...Object.values(seniorityLevel)),
        softSkills: joi.array().items(joi.string()),
        technicalSkills: joi.array().items(joi.string()),
        workingTime: joi.string().valid(...Object.values(workingTime)),
    }),
    headers: generalFieldes.headers
}

export const deleteJobValidation = {
    headers: generalFieldes.headers
}