import Ride from "../model/Ride.js";
import User from "../model/User.js";
import { encrypt } from "../utils/encryption.js";
import {
  sendError,
  sendSuccess,
  sendValidationError,
} from "../utils/response.js";
import { validateCreateRide } from "../utils/validator.js";

export const createRide = async (req, res) => {
  try {
    const { error, value } = validateCreateRide(req.body);

    if (error) {
      const errorMessages = error.details.map((detail) => detail.message);
      return sendValidationError(res, errorMessages, null, 400);
    }

    const { pickUpPoint } = value;
    const currentTime = new Date();
    if (new Date(pickUpPoint.departureTime) <= currentTime) {
      return sendError(res, "Departure time must be in the future.", null, 400);
    }

    const newRide = new Ride({
      ...value,
      driverId: req.user.id,
    });
    await newRide.save();

    const user = await User.findById(req.user.id);
    user.ridesCreated.push(newRide._id);
    await user.save();

    return sendSuccess(res, "Ride Created Successfully", newRide);
  } catch (error) {
    console.error("Error creating ride:", error);
    return sendError(res, "Internal server error.", null);
  }
};

export const getRides = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      pickupLocation,
      destinationLocation,
    } = req.body;

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);

    if (pageNumber < 1 || limitNumber < 1) {
      return sendError(
        res,
        "Page and limit should be positive numbers.",
        null,
        400
      );
    }

    const skip = (pageNumber - 1) * limitNumber;

    let filterCriteria = { status: "open" };

    if (pickupLocation && destinationLocation) {
      filterCriteria = {
        $or: [
          {
            $and: [
              { "pickUpPoint.location": pickupLocation },
              {
                $or: [
                  { "destinationPoint.location": destinationLocation },
                  { "midStops.location": destinationLocation },
                ],
              },
            ],
          },
          {
            $and: [
              { "midStops.location": pickupLocation },
              { "destinationPoint.location": destinationLocation },
            ],
          },
        ],
      };
    }

    let rides = await Ride.find(filterCriteria)
      .skip(skip)
      .limit(limitNumber)
      .select("-requestedUsers -passengers")
      .populate("driverId", "fullname avatar")
      .sort({ createdAt: -1 });

    const totalRides = await Ride.countDocuments(filterCriteria);
    const totalPages = Math.ceil(totalRides / limitNumber);

    rides = rides.map((ride) => ({
      ...ride.toObject(),
      _id: encrypt(ride._id.toString()),
      driverId: {
        _id: encrypt(ride.driverId._id.toString()),
        fullname: ride.driverId.fullname,
      },
    }));

    return sendSuccess(res, "Rides fetched successfully", {
      rides,
      totalRides,
      totalPages,
      currentPage: pageNumber,
    });
  } catch (error) {
    console.error("Error fetching rides:", error);
    return sendError(res, "Internal server error.", null);
  }
};
