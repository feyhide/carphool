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
    city: {
      type: String,
      required: true,
    },
    pickUpPoint: {
      type: String,
      required: true,
    },
    pickUpTime: {
      type: Date,
      required: true,
    },
    destinationPoint: {
      type: String,
      required: true,
    },
    midStops: [
      {
        _id: false,
        type: String,
        required: true,
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
      amount: { type: Number, required: true, min: 0 },
      currency: { type: String, required: true },
    },
  },
  { timestamps: true }
);

const Ride = mongoose.model("Ride", rideSchema);

export default Ride;
