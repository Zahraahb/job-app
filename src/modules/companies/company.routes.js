import { Router } from "express";
import { systemRoles } from "../../../utils/commen/enum.js";
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
import * as CV from "./company.validation.js"
import * as CC from "./company.controller.js"


const router = Router();

router.post(
  "/add-company",validation(CV.addCompanyValidation),
  auth([systemRoles.COMPANY_HR]),
  CC.addCompany
);

router.patch(
  "/update-company/:companyId",
  validation(CV.companyUpdateValidation),
  auth([systemRoles.COMPANY_HR]),
  CC.updateCompany
);
export default router; 

router.delete(
  "/delete-company/:companyId",
  validation(CV.companyDeleteValidation),
  auth([systemRoles.COMPANY_HR]),
  CC.deleteCompany
);

router.get(
  "/company/:companyId",
  auth([systemRoles.COMPANY_HR]),
  CC.getCompany
);

router.get(
  "/company",
  auth([systemRoles.COMPANY_HR, systemRoles.USER]),
  CC.getCompanyByName
);

router.get(
  "/company/applications",
  auth([systemRoles.COMPANY_HR]),
  CC.getApplicationsByJob
);