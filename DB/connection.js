import mongoose from "mongoose";

const connectDB = () => {
  mongoose
    .connect(process.env.DB_ATLAS)
    .then(() => console.log("DB Is Connected ....."))
    .catch(() => console.log("There Is Something Wrong In DB Connection ..."));
};


export default connectDB