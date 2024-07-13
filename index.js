import dotenv from "dotenv"
dotenv.config();
import express from "express";
import connectionDB from "./db/connectionDB.js";
import usersRouter from "./src/modules/users/user.routes.js";
import jobsRouter from "./src/modules/jobs/job.routes.js";
import companiesRouter from "./src/modules/companies/company.routes.js";
import { AppError } from "./utils/classError.js";
import { globalErrorHandling } from "./utils/globalErrorHandler.js";

const app = express();
const port = 3000;

connectionDB();

app.use(express.json());
app.use("/users", usersRouter);
app.use("/jobs", jobsRouter);
app.use("/companies", companiesRouter);

app.get("/", (req, res) => res.send("Hello World!"));

app.use("*", (req, res, next) => {
  return next(new AppError(`invalid url ${req.originalUrl}`, 404));
});

//global error handling middleware
app.use(globalErrorHandling);
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
