import mongoose from "mongoose";
import Profile from "../models/Profile";
import Session from "../models/Session"


class DbContext {
  Profile = mongoose.model("Profile", Profile);
  Session = mongoose.model("Session", Session);

}

export const dbContext = new DbContext();
