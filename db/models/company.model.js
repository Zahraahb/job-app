import { Schema, model } from "mongoose";

export const validatenumberOfEmployees =(value) =>{
  const regex = /^\d+-\d+$/;
  if(!regex.test(value)){
    return false;
  }
  const [min, max] = value.split("-").map(Number);
  return min < max;
}
const companyShema = new Schema({
  companyName: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  industry: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  numberOfEmployees: {
    type: String,
    validate: {
      validator: validatenumberOfEmployees,
      message: "Number of employees should be in format 'min-max'",
    },
  },
  companyEmail: {
    type: String,
    required: true,
    unique: true,
  },
  companyHR: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
});

const companyModel = model("company",companyShema);
export default companyModel;