import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicle: {
      name: { type: String, required: true },
      type: { type: String, enum: ["bike", "car"], required: true },
    },
    description: {
      type: String,
    },
    pickUpPoint: {
      location: {
        type: String,
        required: true,
      },
      departureTime: {
        type: Date,
        required: true,
      },
      description: {
        type: String,
      },
    },
    destinationPoint: {
      location: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
    },
    midStops: [
      {
        _id: false,
        location: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
      },
    ],
    seatsAvailable: {
      type: Number,
      required: true,
    },
    passengers: [
      {
        _id: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    requestedUsers: [
      {
        _id: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    status: {
      type: String,
      default: "open",
      enum: ["full", "close", "open"],
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

const Ride = mongoose.model("Ride", rideSchema);

export default Ride;
