/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import api from "../utils/refresher";
import { DOMAIN } from "../utils/constant";
import toast, { Toaster } from "react-hot-toast";
import RideCard from "../components/RideCard";
import Profile from "./Profile";
import Create from "./Create";

const Home = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [rides, setRides] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { isProfileOpen, isCreateOpen } = useSelector((state) => state.sidebar);

  const fetchRides = async () => {
    setLoading(true);
    try {
      const { data } = await api.post(
        DOMAIN + "ride/get-rides",
        { page },
        { withCredentials: true }
      );
      if (data.success) {
        setRides(data.data.rides);
        console.log(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error.response);
      toast.error(error.response?.data.message || "an error occured");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  return !currentUser ? (
    <div className="w-screen z-50 absolute top-0 bg-white h-screen flex flex-col primary gap-5 items-center justify-center">
      <div className="w-full flex flex-col items-center justify-center">
        <img className="w-16" src="/image/car.png" />
        <p className="primary text-3xl -mt-4 font-semibold text-black">
          Carphool
        </p>
      </div>
      <div className="flex flex-col w-full justify-center items-center">
        <Link
          to={"/sign-in"}
          className="underline text-base sm:text-lg md:text-xl text-gray-500 hover:text-black transition-all ease"
        >
          Log in to your account
        </Link>
        <Link
          to={"/sign-up"}
          className="underline text-base sm:text-lg md:text-xl text-gray-500 hover:text-black transition-all ease"
        >
          Create An Account
        </Link>
      </div>
    </div>
  ) : (
    <div className="w-screen h-[90vh] flex">
      <Toaster />
      <div className="w-1/2 px-10 py-10 h-full relative overflow-y-auto">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="text-lg font-semibold text-gray-500">
              Loading...
            </div>
          </div>
        ) : (
          <div className="">
            {rides.length === 0 ? (
              <div className="w-full primary text-xl">No Rides Available</div>
            ) : (
              rides.map((ride, index) => <RideCard key={index} ride={ride} />)
            )}
          </div>
        )}
      </div>
      <div className="w-1/2 h-full py-10 flex items-center justify-end px-10">
        <div className="w-1/2 h-full rounded-xl overflow-hidden">
          {isProfileOpen ? <Profile /> : isCreateOpen ? <Create /> : ""}
        </div>
      </div>
    </div>
  );
};

export default Home;
