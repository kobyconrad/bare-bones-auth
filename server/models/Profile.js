import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Profile = new Schema(
  {
    // email: { type: String, lowercase: true, unique: true },
    username: { type: String, lowercase: true, unique: true },
    password: { type: String, required: true },
    _queryable: { type: Boolean, default: true }
    // NOTE If you wish to add additional public properties for profiles do so here
  },
  { timestamps: true, toJSON: { virtuals: true } }
);
export default Profile;