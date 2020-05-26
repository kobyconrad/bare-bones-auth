import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Session = new Schema(
  {
    token: { type: String, lowercase: true },
    username: { type: String, required: true },
    loggedIn: { type: Boolean, default: true },
    _queryable: { type: Boolean, default: true }
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default Session;