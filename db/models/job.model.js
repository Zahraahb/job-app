import { Schema, model } from "mongoose";
import { location, seniorityLevel, workingTime } from "../../utils/commen/enum.js";

const jobSchema = new Schema(
  {
    jobTitle: {
      type: String,
      required: true,
    },
    jobLocation: {
      type: String,
      enum: Object.values(location),
      required: true,
    },
    workingTime: {
      type: String,
      enum: Object.values(workingTime),
      required: true,
    },
    seniorityLevel: {
      type: String,
      enum: Object.values(seniorityLevel),
      required: true,
    },
    technicalSkills: {
      type: [String],
      required: true,
    },
    jobDescription: {
      type: String,
      required: true,
    },
    softSkills: {
      type: [String],
      required: true,
    },
    addedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: "company",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const jobModel = model("job", jobSchema);
export default jobModel;