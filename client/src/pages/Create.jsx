import { useState, useRef, useEffect } from "react";
import { SmallButton } from "../components/Button";
import toast from "react-hot-toast";
import { countryCurCode } from "../utils/utility";
import { useSelector } from "react-redux";
import api from "../utils/refresher";
import { DOMAIN } from "../utils/constant";

const Create = () => {
  const [rideDetails, setRideDetails] = useState({
    vehicle: { name: "", type: "car" },
    description: "",
    pickUpPoint: "",
    pickUpTime: "",
    destinationPoint: "",
    midStops: [],
    seatsAvailable: 1,
    price: { amount: 1, currency: "" },
    city: "",
  });

  const { currentUser } = useSelector((state) => state.user);

  const [midPoint, setMidPoint] = useState({
    location: "",
    description: "",
  });

  useEffect(() => {
    if (currentUser.liveLocation) {
      setRideDetails((prevState) => ({
        ...prevState,
        city: currentUser.liveLocation.city,
        price: {
          ...prevState.price,
          currency:
            countryCurCode.find(
              (e) => e.country === currentUser.liveLocation.country
            ).code || "USD",
        },
      }));
    }
  }, [currentUser]);

  const formRef = useRef(null);

  const validTextRegex = /^[A-Za-z0-9\s,!.]*$/;
  const isValidText = (text) => text && validTextRegex.test(text);
  const isValidNumber = (num) => !isNaN(num) && num > 0;
  const isValidFutureTime = (timeString) => {
    const selectedTime = new Date(timeString);
    return !isNaN(selectedTime.getTime()) && selectedTime > new Date();
  };

  const validateRideDetails = (details) => {
    const errors = [];

    if (!isValidText(details.vehicle.name))
      errors.push("Invalid vehicle name.");
    if (!["car", "bike"].includes(details.vehicle.type))
      errors.push("Vehicle type must be 'car' or 'bike'.");
    if (!details.city) errors.push("City is required.");
    if (!isValidNumber(details.seatsAvailable))
      errors.push("Seats available must be greater than 0.");
    if (!isValidNumber(details.price.amount))
      errors.push("Price must be greater than 0.");
    if (!isValidText(details.pickUpPoint))
      errors.push("Invalid pick-up location.");
    if (!isValidText(details.destinationPoint))
      errors.push("Invalid destination location.");
    if (!isValidFutureTime(details.pickUpTime))
      errors.push("Invalid pickup time. Must be in future");

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = validateRideDetails(rideDetails);
    if (errors.length > 0) {
      errors.forEach((error) => toast.error(error));
      return;
    }

    try {
      const {
        vehicle,
        description,
        pickUpPoint,
        pickUpTime,
        destinationPoint,
        midStops,
        seatsAvailable,
        price,
        city,
      } = rideDetails;

      const { data } = await api.post(
        DOMAIN + "ride/create-ride",
        {
          vehicle,
          description,
          pickUpPoint,
          pickUpTime,
          destinationPoint,
          midStops,
          seatsAvailable,
          price,
          city,
        },
        { withCredentials: true }
      );

      if (data.success) {
        console.log(data);
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log("Error Creating Ride", error);
      toast.error("Error Creating Ride");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const nameParts = name.split(".");

    if (name === "price" || name === "seatsAvailable") {
      if (value <= 0) {
        return;
      }
    }

    setRideDetails((prevState) => {
      let updatedState = { ...prevState };
      let current = updatedState;

      nameParts.forEach((part, index) => {
        if (index === nameParts.length - 1) {
          current[part] = value;
        } else {
          current = current[part];
        }
      });

      return updatedState;
    });
  };

  const resizeTextArea = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const handleAddMidStop = () => {
    if (midPoint.location === "" || midPoint.description === "") {
      toast.error("Mid Stops cannot be added empty");
      return;
    }

    if (
      !validTextRegex.test(midPoint.location) ||
      !validTextRegex.test(midPoint.description)
    ) {
      toast.error("Mid Stops Inputs must be string");
      return;
    }

    setRideDetails((prevState) => ({
      ...prevState,
      midStops: [...prevState.midStops, midPoint],
    }));

    setMidPoint({ location: "", description: "" });

    if (formRef.current) {
      formRef.current.scrollTo({
        top: formRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  const handleRemoveMidStop = (index) => {
    setRideDetails((prevState) => ({
      ...prevState,
      midStops: prevState.midStops.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="w-full h-full text-white p-5 primary bg-[#5ED3FF] flex flex-col">
      <p className="text-3xl font-bold mb-5">Create Ride</p>
      <div className="w-full flex flex-col gap-3 overflow-y-auto flex-grow">
        <div className="w-full flex gap-2 flex-col">
          <label className="text-xl">Vehicle Name:</label>
          <input
            className="bg-transparent border-b-2 border-[#cfcfcf67] outline-none hover:border-white"
            type="text"
            name="vehicle.name"
            value={rideDetails.vehicle.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="w-full flex gap-2 flex-col">
          <label className="text-xl">Vehicle Type:</label>
          <select
            name="vehicle.type"
            className="bg-transparent border-[#cfcfcf67] outline-none hover:border-white border-b-2"
            value={rideDetails.vehicle.type}
            onChange={handleChange}
            required
          >
            <option className="text-black outline-none" value="bike">
              Bike
            </option>
            <option className="text-black outline-none" value="car">
              Car
            </option>
          </select>
        </div>
        <div className="w-full flex gap-2 flex-col">
          <label className="text-xl">Description:</label>
          <textarea
            placeholder="(optional)"
            name="description"
            className="bg-transparent border-[#cfcfcf67] outline-none hover:border-white border-b-2"
            value={rideDetails.description}
            onChange={(e) => {
              handleChange(e);
              resizeTextArea(e);
            }}
            style={{ overflowY: "hidden" }}
            rows={2}
          />
        </div>
        <div className="w-full flex gap-2 flex-col">
          <label className="text-xl">Seats Available:</label>
          <input
            className="bg-transparent border-b-2 border-[#cfcfcf67] outline-none hover:border-white"
            type="number"
            name="seatsAvailable"
            value={rideDetails.seatsAvailable}
            min={1}
            onChange={handleChange}
            required
          />
        </div>
        <div className="w-full flex gap-2 flex-col">
          <label className="text-xl">Price:</label>
          <input
            className="bg-transparent border-b-2 border-[#cfcfcf67] outline-none hover:border-white"
            type="number"
            name="price.amount"
            min={1}
            value={rideDetails.price.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="w-full flex gap-2 flex-col">
          <label className="text-xl">Pick-Up Location:</label>
          <input
            className="bg-transparent border-b-2 border-[#cfcfcf67] outline-none hover:border-white"
            type="text"
            name="pickUpPoint"
            value={rideDetails.pickUpPoint}
            onChange={handleChange}
            required
          />
        </div>
        <div className="w-full flex gap-2 flex-col">
          <label className="text-xl">Pick-Up Time:</label>
          <input
            className="bg-transparent border-b-2 border-[#cfcfcf67] outline-none hover:border-white"
            type="datetime-local"
            name="pickUpTime"
            value={rideDetails.pickUpTime}
            onChange={handleChange}
            required
          />
        </div>
        <div className="w-full flex gap-2 flex-col">
          <label className="text-xl">Destination Location:</label>
          <input
            className="bg-transparent border-b-2 border-[#cfcfcf67] outline-none hover:border-white"
            type="text"
            name="destinationPoint"
            value={rideDetails.destinationPoint}
            onChange={handleChange}
            required
          />
        </div>

        <div className="w-full flex gap-2 flex-col">
          <label className="text-xl">City:</label>
          {rideDetails.city === "" ? (
            <p>Loading your location...</p>
          ) : (
            <input
              className="bg-transparent border-b-2 border-[#cfcfcf67] outline-none hover:border-white"
              type="text"
              name="city"
              value={rideDetails.city}
              onChange={handleChange}
              disabled
              required
            />
          )}
        </div>

        <div className="w-full flex flex-col gap-2">
          <label className="text-xl">Mid Stops:</label>
          {rideDetails.midStops.length > 0 &&
            rideDetails.midStops.map((midStop, index) => (
              <div key={index} className="flex gap-2 flex-col">
                <div className="flex flex-col gap-2">
                  <p className="bg-transparent border-b-2 border-[#cfcfcf67] outline-none hover:border-white">
                    {midStop.location}
                  </p>
                  <p className="bg-transparent border-b-2 border-[#cfcfcf67] outline-none hover:border-white">
                    {midStop.description}
                  </p>

                  <div className="w-full flex items-center justify-center">
                    <SmallButton
                      text={"Remove"}
                      onClick={() => handleRemoveMidStop(index)}
                      responsive={true}
                      bgColor={"red-500"}
                      textBefColor={"#000000"}
                      textAfterColor={"#ffffff"}
                    />
                  </div>
                </div>
              </div>
            ))}

          <div className="flex flex-col gap-2">
            <input
              className="bg-transparent border-b-2 border-[#cfcfcf67] outline-none hover:border-white"
              type="text"
              name="midpointLocation"
              value={midPoint.location}
              onChange={(e) =>
                setMidPoint({ ...midPoint, location: e.target.value })
              }
              placeholder="Mid Stop Location"
            />
            <input
              className="bg-transparent border-b-2 border-[#cfcfcf67] outline-none hover:border-white"
              type="text"
              name="midpointDescription"
              value={midPoint.description}
              onChange={(e) =>
                setMidPoint({ ...midPoint, description: e.target.value })
              }
              placeholder="Mid Stop Description"
            />
          </div>
          <div className="w-full flex items-center justify-center">
            <SmallButton
              text={"Add Mid Stop"}
              onClick={handleAddMidStop}
              responsive={true}
              bgColor={"blue-500"}
              textBefColor={"#000000"}
              textAfterColor={"#ffffff"}
            />
          </div>
        </div>

        <div className="w-full flex items-center justify-center">
          <SmallButton
            text={"Create"}
            onClick={handleSubmit}
            responsive={true}
            bgColor={"green-500"}
            textBefColor={"#000000"}
            textAfterColor={"#ffffff"}
          />
        </div>
      </div>
    </div>
  );
};

export default Create;
