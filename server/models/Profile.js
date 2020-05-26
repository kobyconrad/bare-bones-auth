import mongoose from "mongoose";
const Schema = mongoose.Schema;

const Profile = new Schema(
  {
    subs: [{ type: String, unique: false, required: false }],
    hashPassword: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, unique: false },
    _queryable: { type: Boolean, default: true }
    // NOTE If you wish to add additional public properties for profiles do so here
  },
  { timestamps: true, toJSON: { virtuals: true } }
);

export default Profile;