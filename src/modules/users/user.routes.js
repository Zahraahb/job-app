import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import * as UC from "./user.controller.js";
import { validation } from "../../middleware/validation.js";
import * as UV from "./user.validation.js";
const router = Router();

router.post('/signup',validation(UV.signUpValidation),UC.signUp)
router.get(
  "/confirm-email/:token",
  validation(UV.signInValidation),
  UC.confirmEmail
);
router.post("/signin", UC.signIn);
router.patch("/update" ,auth(),UC.updateAccount);
router.delete("/delete", auth(), UC.deleteAccount);
router.get("/account", auth(), UC.getAccount);
router.get("/account/:userId", UC.getUserProfile);
router.patch("/update-password", auth(), UC.updatePassword);
router.post("/forget-password", UC.forgetPassword);
router.post("/reset-password", UC.resetPassword);
router.get("/accounts/:recoveryEmail", UC.getAccountsByRecoveryEmail);
export default router;
