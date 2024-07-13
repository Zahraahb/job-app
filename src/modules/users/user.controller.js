import userModel from "../../../db/models/user.model.js";
import { AppError } from "../../../utils/classError.js";
import { asyncHandler } from "../../../utils/globalErrorHandler.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { status, systemRoles } from "../../../utils/commen/enum.js";
import { sendEmail } from "../../service/sendEmail.js";
import companyModel from "../../../db/models/company.model.js";

//sign Up with email, password, firstName and lastName as requiered data (data is taken from body)
//password is beeing hashed for security purposes
//email of confirmation is sending to email ton confirm it exists

export const signUp = asyncHandler(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
  } = req.body;

  const emailPhoneExist = await userModel.findOne({ email, mobileNumber });
  if (emailPhoneExist) {
    return next(new AppError("user already exists", 409));
  }
  const token = jwt.sign(
    { email, recoveryEmail, mobileNumber },
    process.env.email_confirmKey,
    { expiresIn: 60 * 60 }
  );
  const link = `http://localhost:3000/users/confirmEmail/${token}`;
  const checkEmail = await sendEmail(
    email,
    "Sign up confirmation",
    `<a href="${link}">click here to confirm your email</a>`
  );
  if (!checkEmail) {
    return next(
      new AppError(
        "can not send confirmatio link to this email, check if your email correct!",
        409
      )
    );
  }
  const hashPassword = bcrypt.hashSync(
    password,
    Number(process.env.salt_rounds)
  );
  const user = await userModel.create({
    firstName,
    lastName,
    email,
    password: hashPassword,
    recoveryEmail,
    DOB,
    mobileNumber,
    role,
  });
  return res.status(200).json({ msg: "done", user });
});

//================================================================
//confirm Email

export const confirmEmail = asyncHandler(async (req, res, next) => {
  const { token } = req.params;
  const decoded = jwt.verify(token, process.env.email_confirmKey);
  if (!decoded) {
    return next(new AppError("Invalid token", 409));
  }
  if (!decoded?.email) {
    return next(new AppError("Invalid payload", 409));
  }

  const user = await userModel.findOneAndUpdate(
    { email: decoded.email, confirmed: false },
    { confirmed: true },
    { new: true }
  );
  if (!user) {
    return next(new AppError("user not found or already confirmed!", 409));
  }
  return res.status(200).json({ msg: "done" });
});

//sign In with email or recoveryEmail or mobileNumber and password (data is taken from body)

export const signIn = asyncHandler(async (req, res, next) => {
  const { recoveryEmail, mobileNumber, email, password } = req.body;

  const user = await userModel.findOneAndUpdate(
    {
      $or: [{ email }, { recoveryEmail }, { mobileNumber }],
      status: status.OFFLINE,
      confirmed: true,
    },
    { status: status.ONLINE },
    { new: true }
  );
  if(!user) {
    return next(new AppError("user not found or already logged In!", 409));
  }

  const match = bcrypt.compareSync(password, user.password);

  if (!match) {
    return next(new AppError("user not found or already logged In!", 409));
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
    },
    "oyznr",
    {
      expiresIn: "1d",
    }
  );
  return res.status(200).json({ msg: "user logged in successfully", token });
});

//================================================================

//update account email , mobileNumber , recoveryEmail , DOB , lastName , firstName
//owner only can update account while logged in

export const updateAccount = asyncHandler(async (req, res, next) => {
  const { email, mobileNumber, recoveryEmail, DOB, lastName, firstName } = req.body;
  const userExists = await userModel.findOne({email,mobileNumber})
  if(userExists&& email !== req.body.email && mobileNumber !== req.body.mobileNumber) {
    return next(new AppError("email or mobile number already exists!", 409));
  }
  const user = await userModel.findById(req.user.id)
  
  const update = await userModel.findByIdAndUpdate(
    req.user.id,
    { email, mobileNumber, recoveryEmail, DOB, lastName, firstName },
    { new: true }
  );
   return res.status(200).json({ msg: "Account updated successfully",update });

    
});

//delete account from owner while logged in

export const deleteAccount = asyncHandler(async (req, res, next) => {
  const deleteAcc = await userModel.findByIdAndDelete(req.user.id,{new: true});
  if (!deleteAcc) {
      return next(new AppError("user not found or already deleted!", 409));
    }
  if(req.user.role==systemRoles.COMPANY_HR){
    const updateCompany = await companyModel.findOneAndUpdate({companyHR:req.user._id},{companyHR:null})
    
  }
  return res.status(200).json({ msg: "Account deleted successfully" });
});

//get user account by owner only

export const getAccount = asyncHandler(async (req, res, next) => {
  
  return res.status(200).json({ msg: "done", user: req.user });
});

//Get profile data for another user 

export const getUserProfile = asyncHandler(async (req, res, next) => {
    const user = await userModel
      .findById(req.params.userId)
      .select("firstName lastName email mobileNumber DOB ");
      return res.status(200).json({ msg: "done", user });
      

})

//================================================
//update password

export const updatePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await userModel.findById(req.user.id);

  const match = bcrypt.compareSync(currentPassword, user.password);

  if (!match) {
    return next(new AppError("password is incorrect!", 409));
  }

  const hashPassword = bcrypt.hashSync(
    newPassword,
    Number(process.env.salt_rounds)
  );

  const updatePassword = await userModel.findByIdAndUpdate(
    req.user.id,
    { password: hashPassword },
    { new: true }
  );

  return res.status(200).json({ msg: "Password updated successfully", updatePassword });
});

//================================================================

//forget password (OTP sent to email)
//1-check if email exists
//2-generate OTP and OTP expire time and ingected to user data
//3-send email with OTP

export const forgetPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return next(new AppError("user not found!", 409));
  }

  const OTP = Math.floor(100000 + Math.random() * 900000).toString();
  user.OTP = OTP;
  const OTPExpierTime = Date.now() + 300000; //OTP expires in 5 minutes
  user.OTPExpierTime = OTPExpierTime;
  await user.save();

  const checkEmail = await sendEmail(
    email,
    "Reset Your Password",
    `<p>your reset code : ${OTP} (expires after 5 mins)</p>`
  );
  if (!checkEmail) {
    return next(
      new AppError(
        "can not send email!",
        409
      )
    )}
    
   return res
     .status(200)
     .json({ msg: "reset code sent to your email" });

  })


  //reset password after sending OTP

  export const resetPassword = asyncHandler(async(req, res, next) => {

    const { email, resetCode, newPassword} = req.body

    const user = await userModel
      .findOne({ email, OTP: resetCode })
      .where('OTPExpierTime').gt(Date.now());
    if (!user) {
      return next(new AppError("worng email or Invalid OTP or expired OTP!", 409));
    }
    const hashPassword = bcrypt.hashSync(
      newPassword,
      Number(process.env.salt_rounds)
    );
    const updatePassword = await userModel.findByIdAndUpdate(
      user._id,
      { password: hashPassword },
      { new: true }
    );
    return res.status(200).json({ msg: "Password reset successfully" });


  })

 //Get all accounts associated to a specific recovery Email 

  export const getAccountsByRecoveryEmail = asyncHandler(async (req, res, next) => {
    const { recoveryEmail } = req.params;
    const users = await userModel
     .find({ recoveryEmail })
     .select("firstName lastName email mobileNumber DOB status");
     if(!users){
        return next(new AppError("No accounts found!", 409));
     }

     
    return res.status(200).json({ msg: "done", users });
  });



