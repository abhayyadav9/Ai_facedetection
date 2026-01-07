import mongoose from "mongoose";

const conecttedDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conected to the mongodb database");
  } catch (error) {
    console.log(error);
  }
};


export default conecttedDb;