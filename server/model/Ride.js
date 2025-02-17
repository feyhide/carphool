import mongoose from "mongoose";

const rideSchema = new mongoose.Schema(
  {
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    vehicle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    startPoint: {
      location: {
        type: String,
        required: true,
      },
      arrivalTime: {
        type: Date,
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
    endPoint: {
      location: {
        type: String,
        required: true,
      },
      arrivalTime: {
        type: Date,
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
    midStops: [
      {
        location: {
          type: String,
          required: true,
        },
        arrivalTime: {
          type: Date,
        },
        departureTime: {
          type: Date,
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
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    requestedUsers: [
      {
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
