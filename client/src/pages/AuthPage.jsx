/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */

import React, { useEffect, useState } from "react";
import Input from "../components/Input";
import { Button } from "../components/Button";
import { Link, useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { addUser } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import axios from "axios";
import { DOMAIN } from "../utils/constant";
import api from "../utils/refresher";

const AuthPage = ({ page }) => {
  const [showPassword, setshowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(null);
  const [otpState, setotpState] = useState(false);
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const userAuthServer = async (serverRoute, formData) => {
    setLoading(true);
    try {
      const filteredFormData = { ...formData };
      if (page === "signin") {
        delete filteredFormData.fullname;
        delete filteredFormData.username;
      }

      const { data } = await api.post(DOMAIN + serverRoute, filteredFormData, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (data.success) {
        if (data.message.includes("OTP")) {
          setotpState(true);
        } else {
          dispatch(addUser(data.data));
          navigate("/");
        }
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    const serverRoute = page === "signin" ? "auth/sign-in" : "auth/sign-up";
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d]{6,20}$/;

    const { email, password, username, fullname } = formData;

    if (page === "signup") {
      if (fullname.length < 3) {
        return toast.error("Name must be at least 3 letters long.");
      }
      if (!username) {
        return toast.error("Username is required.");
      }
    }
    if (!email.length) {
      return toast.error("Email is required.");
    }
    if (!emailRegex.test(email)) {
      return toast.error("Email is invalid.");
    }
    if (!passwordRegex.test(password)) {
      return toast.error(
        "Password should be 6-20 characters long with at least one numeric digit, one lowercase, one uppercase letter, and no special characters."
      );
    }
    //userAuthServer(serverRoute, formData);
    console.log(serverRoute, formData);
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    try {
      const otpregex = /^\d{6}$/;

      if (!otpregex.test(otp)) {
        return toast.error("OTP is invalid.");
      }

      const { data } = await axios.post(DOMAIN + "auth/verify-otp", {
        email: formData.email,
        otp,
      });

      if (data.success) {
        toast.success(data.message);
        dispatch(addUser(data.data));
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(DOMAIN + "auth/reset-link", {
        email: formData.email,
      });

      if (data.success) {
        setFormData({
          fullname: "",
          username: "",
          email: "",
          password: "",
        });
        toast.success(data.message);
        setTimeout(() => {
          setLoading(false);
          window.close();
        }, 5000);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred");
      setLoading(false);
    }
  };

  useEffect(() => {
    setFormData({
      fullname: "",
      username: "",
      email: "",
      password: "",
    });
    setotpState(false);
  }, [page]);

  return (
    <>
      <Toaster />
      <div className="w-screen flex h-screen overflow-hidden">
        <div className="w-full absolute top-0 lg:relative lg:w-[50%] h-full">
          <img src="/image/bg.jpg" className="w-full h-full object-cover" />
        </div>
        <div className="w-full lg:w-[50%] h-full bg-white bg-opacity-70 lg:bg-opacity-100 z-10">
          <div className="w-full h-full flex flex-col items-center justify-center">
            <div className="w-full flex flex-col items-center justify-center">
              <img className="w-16" src="/image/car.png" />
              <p className="primary text-3xl -mt-4 font-semibold text-black">
                Carphool
              </p>
            </div>
            <div className="w-[70%] primary flex flex-col gap-2 h-auto p-5">
              {page == "reset" ? (
                <>
                  <p className="w-full text-center text-3xl md:text-4xl">
                    Reset Password
                  </p>
                  <div className="flex flex-col w-full">
                    <Input
                      name="email"
                      onChange={handleChange}
                      value={formData.email}
                      type="text"
                      placeholder="Email"
                    />
                  </div>
                  <Button
                    text={loading ? "Submitting..." : "Submit"}
                    onClickState={loading}
                    onClick={handleForgotPassword}
                    responsive={true}
                    bgColor={"black"}
                    textBefColor={"#ffffff"}
                    textAfterColor={"#000000"}
                  />
                  <div className="flex flex-col w-full justify-center items-center">
                    <Link
                      to={"/sign-in"}
                      onClick={() => setotpState(false)}
                      className="underline text-base sm:text-lg md:text-xl text-gray-500 hover:text-black transition-all ease"
                    >
                      Log in to your account
                    </Link>
                    <Link
                      onClick={() => setotpState(false)}
                      to={"/sign-up"}
                      className="underline text-base sm:text-lg md:text-xl text-gray-500 hover:text-black transition-all ease"
                    >
                      Create An Account
                    </Link>
                  </div>
                </>
              ) : (page === "signUp" || page === "signIn") && !otpState ? (
                <>
                  <p className="w-full text-center text-3xl md:text-4xl">
                    {page === "signUp" ? "Create An Account" : "Log In"}
                  </p>
                  {page === "signUp" && (
                    <>
                      <div className="flex flex-col w-full">
                        <Input
                          name="fullname"
                          onChange={handleChange}
                          value={formData.fullname}
                          type="text"
                          placeholder="Name"
                        />
                      </div>
                      <div className="flex flex-col w-full">
                        <Input
                          name="username"
                          onChange={handleChange}
                          value={formData.username}
                          type="text"
                          placeholder="Username"
                        />
                      </div>
                    </>
                  )}
                  <div className="flex flex-col w-full">
                    <Input
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      type="text"
                      placeholder="Email"
                    />
                  </div>
                  <div className="w-full flex relative flex-col">
                    <Input
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                    />
                    <img
                      onClick={() => setshowPassword(!showPassword)}
                      src={
                        showPassword ? "/icons/crosseye.png" : "/icons/eye.png"
                      }
                      className="w-7 rounded-full p-1 z-10 absolute top-1/2 right-5 -translate-y-1/2"
                    />
                  </div>
                  <Button
                    text={
                      loading
                        ? "Loading..."
                        : page === "signIn"
                        ? "Sign In"
                        : "Sign Up"
                    }
                    onClickState={loading}
                    onClick={handleSubmit}
                    responsive={true}
                    bgColor={"black"}
                    textBefColor={"#ffffff"}
                    textAfterColor={"#000000"}
                  />
                  <div className="flex flex-col w-full justify-center items-center">
                    <Link
                      to={page === "signIn" ? "/sign-up" : "/sign-in"}
                      className="underline text-base sm:text-lg md:text-xl text-gray-500 hover:text-black transition-all ease"
                    >
                      {page === "signIn"
                        ? "Create An Account"
                        : "Log in to your account"}
                    </Link>
                    {page !== "signUp" && (
                      <Link
                        to={"/reset-password"}
                        className="underline text-base sm:text-lg md:text-xl text-gray-500 hover:text-black transition-all ease"
                      >
                        Forgot Password ?
                      </Link>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col w-full">
                    <Input
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      type="number"
                      placeholder="OTP"
                    />
                  </div>
                  <Button
                    text={loading ? "Verifying..." : "Verify"}
                    responsive={true}
                    onClickState={loading}
                    onClick={handleVerifyOtp}
                    bgColor={"black"}
                    textBefColor={"#ffffff"}
                    textAfterColor={"#000000"}
                  />
                  <div className="flex flex-col w-full justify-center items-center">
                    <Link
                      to={"/sign-in"}
                      onClick={() => setotpState(false)}
                      className="underline text-base sm:text-lg md:text-xl text-gray-500 hover:text-black transition-all ease"
                    >
                      Log in to your account
                    </Link>
                    <Link
                      onClick={() => setotpState(false)}
                      to={"/sign-up"}
                      className="underline text-base sm:text-lg md:text-xl text-gray-500 hover:text-black transition-all ease"
                    >
                      Create An Account
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthPage;
