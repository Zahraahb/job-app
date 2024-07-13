import joi from "joi";
import { systemRoles } from "../../../utils/commen/enum.js";

export const signUpValidation = {
  body: joi.object({
    firstName: joi.string().required(),
    lastName: joi.string().required(),
    email: joi
      .string()
      .email({ tlds: { allow: ["com", "net"] } })
      .required(),
    password: joi
      .string()
      .pattern(
        new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      )
      .required()
      .messages({
        "string.pattern.base":
          "password must have Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
      }),
    recoveryEmail: joi.string().email(),
    DOB: joi
      .string()
      .pattern(
        new RegExp(/^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/)
      ),
    mobileNumber: joi
      .string()
      .pattern(new RegExp(/^(\+\d{1,3}[- ]?)?\d{11}$/))
      .min(10)
      .max(15)
      .messages({
        "string.pattern.base": "phone number not valid",
      }),
    role: joi.string().valid(...Object.values(systemRoles)),
  }),
};


export const signInValidation = joi
  .object({
    recoveryEmail: joi.string().email(),
    mobileNumber: joi
      .string()
      .pattern(new RegExp(/^(\+\d{1,3}[- ]?)?\d{11}$/))
      .min(10)
      .max(15)
      .messages({
        "string.pattern.base": "phone number not valid",
      }),
    email: joi.string().email({ tlds: { allow: ["com", "net"] } }),
    password: joi
      .string()
      .pattern(
        new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/)
      )
      .required()
      .messages({
        "string.pattern.base":
          "password must have Minimum eight characters, at least one uppercase letter, one lowercase letter, one number and one special character",
      }),
  })
  .or("email", "recoveryEmail", "mobileNumber");