import { Schema, model } from "mongoose";


const applicationSchema = new Schema({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: "job",
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  userTechSkills: {
    type: [String],
    required: true,
  },
  userSoftSkills: {
    type: [String],
    required: true,
  },
  userResume:{
    type: String,
    required: true,
  }
},{
  timestamps: true,
});

applicationSchema.virtual('user',{
  ref: 'user',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
})

const applicationModel = model("application", applicationSchema);

export default applicationModel;