import multer from "multer";
import { nanoid } from "nanoid";
import { AppError } from "../../utils/classError.js";
import path from "path";
import fs from "fs";

export const vaildExtentions = {
  pdf: ["application/pdf"],
};

export const multerLocal = (
  customValidation = vaildExtentions.pdf,
  customPath = "general"
) => {
  const allPath = path.resolve(`uploads/${customPath}`);
  if (!fs.existsSync(allPath)) {
    fs.mkdirSync(allPath, { recursive: true });
  }

  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, allPath);
    },
    filename: function (req, file, cb) {
      cb(null, nanoid(5) + file.originalname);
    },
  });
  const fileFilter = function (req, file, cb) {
    if (customValidation.includes(file.mimetype)) {
      return cb(null, true);
    }
    cb(new AppError("file not supported"), false);
  };
  

  const upload = multer({ storage, fileFilter });
  return upload;
};
