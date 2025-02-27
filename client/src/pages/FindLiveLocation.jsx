import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUserLocation } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const FindLiveLocation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const getUserLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;

            try {
              const response = await fetch(
                `https://api.opencagedata.com/geocode/v1/json?key=b32ff87eb2ad43adab4f951ba629edcd&q=${latitude}+${longitude}&pretty=1`
              );
              const data = await response.json();

              if (data.results && data.results.length > 0) {
                const city =
                  data.results[0].components.city ||
                  data.results[0].components.town ||
                  data.results[0].components.village;
                const country = data.results[0].components.country;
                dispatch(
                  setUserLocation({
                    lat: latitude,
                    lon: longitude,
                    city,
                    country,
                  })
                );
                navigate("/");
              }
            } catch (error) {
              console.error("Error fetching location data", error);
              toast.error("Error fetching location data");
            }
          },
          () => {
            console.error("Unable to retrieve location.");
            toast.error("Unable to retrieve location");
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          }
        );
      } else {
        toast.error("Geolocation not supported.");
        console.error("Geolocation not supported.");
      }
    };

    getUserLocation();
  }, [dispatch, navigate]);

  return (
    <div>
      <h2>Finding your live location...</h2>
    </div>
  );
};

export default FindLiveLocation;
