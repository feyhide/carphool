/* eslint-disable no-unused-vars */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { openCreate, openProfile } from "../redux/sidebarSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state) => state.user);

  const handleProfileClick = () => {
    if (currentUser) {
      dispatch(openProfile(currentUser));
    }
  };
  const handleCreateOpen = () => {
    if (currentUser) {
      dispatch(openCreate(true));
    }
  };
  return (
    <header className="w-full px-5 h-[10vh] flex gap-5 items-center bg-transparent">
      <div className="flex flex-col items-center justify-center">
        <img className="w-10" src="/image/car.png" />
        <p className="primary text-xl -mt-2 font-semibold text-black">
          Carphool
        </p>
      </div>
      <div className="w-auto h-[8vh] flex gap-2 items-center px-5 bg-[#eaecee] rounded-xl">
        <img onClick={handleCreateOpen} src="/icons/create.png" />
        <button className="w-[20vw] text-start px-5 primary hover:bg-[#5ED3FF] hover:text-white transition-all ease bg-white text-[#5ED3FF] rounded-xl h-1/2">
          Pick a Location
        </button>
      </div>
      <div>
        <img
          onClick={handleProfileClick}
          src="/icons/profile.png"
          className="w-12"
        />
      </div>
    </header>
  );
};

export default Header;
