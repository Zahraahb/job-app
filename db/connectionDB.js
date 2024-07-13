import mongoose from "mongoose";

const connectionDB = async () => {
  return await mongoose
    .connect(process.env.DB_URL)
    .then(() => {
      console.log("connected to database...");
    })
    .catch((err) => {
      console.log(err);
    });
};

export default connectionDB;
