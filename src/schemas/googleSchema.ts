import mongoose from "mongoose";

const googleUserSchema = new mongoose.Schema({
  googleId: {
    type: String,
    required: true,
    unique: true,
  },
  displayName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  photo: {
    type: String,
  },
  // Add any other necessary fields specific to Google users
});

const GoogleUser = mongoose.model("GoogleUser", googleUserSchema);

export default GoogleUser;
