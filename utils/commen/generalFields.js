import joi from "joi"

export const generalFieldes = {
  headers: joi.object({
    token: joi.string().required(),
    "content-type": joi.string(),
    "content-length": joi.string(),
    accept: joi.string(),
    host: joi.string(),
    "user-agent": joi.string(),
    "accept-encoding": joi.string(),
    connection: joi.string(),
    "cache-control": joi.string(),
    "postman-token": joi.string(),
  }),
};