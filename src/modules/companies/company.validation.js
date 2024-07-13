import joi from "joi";
import { systemRoles } from "../../../utils/commen/enum.js";
import { generalFieldes } from "../../../utils/commen/generalFields.js";
import { objectIdValidation } from "../../../utils/commen/generalValidation.js";

export const addCompanyValidation = {
  body: joi.object({
    companyName: joi.string().required(),
    description: joi.string(),
    industry: joi.string(),
    address: joi.string(),
    companyEmail: joi.string().email().required(),
    numberOfEmployees: joi.string(),
    companyHR: joi.string().custom(objectIdValidation),
  }),
  headers: generalFieldes.headers,
};

export const companyUpdateValidation ={
    body: joi.object({
    companyName: joi.string(),
    cpmpanyEmail: joi.string(),
    companyHR: joi.string().custom(objectIdValidation),
    description: joi.string(),
    industry: joi.string(),
    address: joi.string(),
    numberOfEmployees: joi.string(),
  }),
  headers: generalFieldes.headers

}

export const companyDeleteValidation = {
    headers: generalFieldes.headers
}