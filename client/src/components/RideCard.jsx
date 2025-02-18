/* eslint-disable react/prop-types */
import { formatDateTime } from "../utils/utility";

const RideCard = ({ ride }) => {
  return (
    <div
      style={{
        backgroundImage: `linear-gradient(to right, white, transparent), url(/image/bg-map.png)`,
      }}
      className="p-4 flex flex-col gap-2 primary w-[50%] relative group rounded-md mb-4 shadow-md"
    >
      <div className="flex gap-2 w-fit">
        <div className="flex py-2 flex-col items-center justify-between">
          <div className="w-2 h-2 bg-[#5ED3FF] rounded-full"></div>
          <div className="w-1 h-1/4 bg-[#919191] rounded-xl"></div>
          <div className="w-2 h-2 bg-[#5ED3FF] rounded-full"></div>
        </div>
        <div className="flex w-fit items-start flex-col">
          <div className="flex gap-2 w-fit ">
            <img src="/icons/location.png" className="w-5" />
            <p className="text-center">{ride.pickUpPoint.location}</p>
          </div>
          <div className="flex w-fit gap-2">
            <img src="/icons/location.png" className="w-5" />
            <p className="text-center">{ride.destinationPoint.location}</p>
          </div>
        </div>
      </div>
      <div className="w-full flex gap-2">
        <div className="w-full flex gap-2 items-center">
          <img src="/icons/vehicle.png" className="w-4 h-4" />
          <p className="w-full truncate text-sm">{ride.vehicle}</p>
        </div>
      </div>
      <div className="w-full flex gap-2">
        <div className="w-full flex gap-2 items-center">
          <img src="/icons/seat.png" className="w-4 h-4" />
          <p className="w-full truncate text-sm">
            Seats Left : {ride.seatsAvailable}
          </p>
        </div>
      </div>
      <div className="w-full flex gap-2">
        <div className="w-full flex gap-2 items-center">
          <img src="/icons/clock.png" className="w-4 h-4" />
          <p className="w-full truncate text-sm">
            {formatDateTime(ride.pickUpPoint.departureTime)}
          </p>
        </div>
      </div>
      <div className="w-full flex gap-2">
        <div className="w-full flex gap-2 items-center">
          <img src="/icons/money.png" className="w-4 h-4" />
          <p className="w-full truncate text-sm">${ride.price} / person</p>
        </div>
      </div>
      <div className="w-full flex gap-2">
        <div className="w-full items-center flex gap-2">
          {ride.driverId.avatar ? (
            <img src={ride.driverId.avatar} className="w-5 h-5 rounded-full" />
          ) : (
            <p className="w-5 h-5 text-xs flex items-center justify-center bg-[#5ED3FF] text-white font-semibold rounded-full uppercase">
              {ride.driverId.fullname.charAt(0)}
            </p>
          )}
          <p className="w-full truncate">{ride.driverId.fullname}</p>
        </div>
      </div>
    </div>
  );
};

export default RideCard;
