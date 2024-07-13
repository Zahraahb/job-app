import { Router } from "express";
import { systemRoles } from "../../../utils/commen/enum.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import { multerLocal, vaildExtentions } from "../../service/multerLocal.js";
import * as JC from "./job.controller.js"
import * as JV from "./job.validation.js"

const router = Router();
router.post("/add-job", validation(JV.addJobValidation), auth([systemRoles.COMPANY_HR]), JC.addJob);
router.patch("/update-job/:jobId",validation(JV.updateJobValidation),auth([systemRoles.COMPANY_HR]), JC.updateJob)
router.delete("/delete-job/:jobId",validation(JV.deleteJobValidation),auth([systemRoles.COMPANY_HR]), JC.deleteJob)
router.get("/",auth([systemRoles.COMPANY_HR,systemRoles.USER]) ,JC.getAllJobs)
router.get(
  "/company",
  auth([systemRoles.COMPANY_HR, systemRoles.USER]),
  JC.getCompanyJobs
);
router.get(
  "/job-with-filters",
  auth([systemRoles.COMPANY_HR, systemRoles.USER]),
  JC.jobWithFilters
);

router.post(
  "/apply-job/:jobId",
  auth([systemRoles.USER]),
  multerLocal(vaildExtentions.pdf, `resumes`).single("resume"),
  JC.applyJob
);

export default router;
