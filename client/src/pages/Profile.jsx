import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SmallButton } from "../components/Button";
import { resetUser } from "../redux/userSlice";
import { DOMAIN } from "../utils/constant";
import api from "../utils/refresher";
import { resetSidebar } from "../redux/sidebarSlice";
import { Link } from "react-router-dom";

const Profile = () => {
  const { profileData } = useSelector((state) => state.sidebar);
  const { selectedProfile } = profileData;
  const [logOut, setLogOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleLogOut = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(DOMAIN + "auth/sign-out", {
        withCredentials: true,
      });
      if (data.success) {
        setLogOut(false);
        dispatch(resetSidebar());
        dispatch(resetUser());
      }
    } catch (error) {
      console.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="w-full h-full text-white p-5 primary bg-[#5ED3FF]">
      {logOut ? (
        <div className="w-full h-full flex flex-col items-center justify-center">
          <p className="text-3xl">Confirm Log Out</p>
          <div className="flex gap-2 w-full items-center justify-center">
            <SmallButton
              text={"Cancel"}
              onClick={() => setLogOut(false)}
              responsive={true}
              bgColor={"black"}
              textBefColor={"#f71616"}
              textAfterColor={"#000000"}
            />
            <SmallButton
              text={loading ? "Submitting..." : "Submit"}
              onClickState={loading}
              onClick={handleLogOut}
              responsive={true}
              bgColor={"black"}
              textBefColor={"#ffffff"}
              textAfterColor={"#000000"}
            />
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <div className="w-full flex justify-between">
            <p className="text-2xl">Profile</p>
            <img
              onClick={() => {
                setLogOut(true);
              }}
              src="/icons/logout.png"
              className="w-5 h-5"
            />
          </div>
          <div className="w-full items-center flex gap-2">
            {selectedProfile.avatar ? (
              <img
                src={selectedProfile.avatar}
                className="w-5 h-5 rounded-full"
              />
            ) : (
              <p className="w-5 h-5 text-xs flex items-center justify-center bg-white text-[#5ED3FF] font-semibold rounded-full uppercase">
                {selectedProfile.fullname.charAt(0)}
              </p>
            )}
            <p className="w-full truncate">{selectedProfile.fullname}</p>
          </div>
          <div className="w-full flex flex-col">
            <p>Email : {selectedProfile.email}</p>
          </div>
          <div className="w-full flex flex-col">
            <p>Location : {selectedProfile.location}</p>
          </div>
          <div className="w-full flex flex-col">
            {selectedProfile.currencyPreference ? (
              <p>Currency Preference : {selectedProfile.currencyPreference}</p>
            ) : (
              <Link
                to={"/add-currency-preference"}
                className="w-full flex flex-col hover:bg-white hover:text-black transition-all ease items-center justify-center bg-[#ffffffc5] text-[#3b3b3bc5] rounded-xl"
              >
                <p className="text-xl text-center">
                  Finish Setting Up Your Account
                </p>
                <p>Add Currency Preference and that&apos;s it</p>
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
