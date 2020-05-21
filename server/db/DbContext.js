import mongoose from "mongoose";
import Profile from "../models/Profile";



class DbContext {
  Profile = mongoose.model("Profile", Profile);

}

export const dbContext = new DbContext();
