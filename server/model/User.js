import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    fullname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    currencyPreference: {
      type: String,
    },
    password: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
    },
    accessToken: {
      type: String,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    avatar: {
      type: String,
    },
    accountType: {
      type: String,
      default: "user",
      enum: ["user", "admin"],
    },
    liveLocation: {
      type: String,
      default: "",
    },
    pastRides: [
      {
        rideId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Ride",
        },
        role: {
          type: String,
          enum: ["driver", "passenger"],
        },
      },
    ],
    ridesCreated: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride",
      },
    ],
    requestedRides: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ride",
      },
    ],
    onGoingRide: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ride",
      default: null,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
