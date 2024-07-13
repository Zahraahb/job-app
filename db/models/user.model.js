
import { Schema, model } from "mongoose";
import { systemRoles, status } from "../../utils/commen/enum.js";

const userShema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    recoveryEmail: {
      type: String,
    },
    DOB: {
      type: String,
      validate: {
        validator: function (value) {
          return new RegExp(
            /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/
          ).test(value);
        },
        message: (prop) => `${prop.value} is not valid format for a date`,
      },
    },
    mobileNumber: {
      type: String,
      unique: true,
    },
    role: {
      type: String,
      enum: Object.values(systemRoles),
      default: systemRoles.USER,
    },
    status: {
      type: String,
      enum: Object.values(status),
      default: status.OFFLINE,
    },
    confirmed: {
      type: Boolean,
      default: false,
    },
    OTP: {
      type: Number,
      default: null,
    },
    OTPExpierTime:{
        type: Date,
        default: null,
    }
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

userShema.virtual('username').get(function(){
    return this.firstName + " " + this.lastName;
})



const userModel  = model("user",userShema);
export default userModel;