import axios from "axios";
import { addUser, resetUser } from "../redux/userSlice";
import { store } from "../redux/store";
import { DOMAIN } from "./constant.js";

const api = axios.create({
  baseURL: DOMAIN,
  withCredentials: true,
});

const refreshAccessToken = async (dispatch) => {
  try {
    const { data } = await axios.get(DOMAIN + "auth/refresh-token", {
      withCredentials: true,
    });
    if (data.success) {
      dispatch(addUser(data.data));
    }
    return true;
  } catch (error) {
    console.error("Token refresh failed:", error);
    logout(dispatch);
    return false;
  }
};

const logout = (dispatch) => {
  console.log("Logging out...");

  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  dispatch(resetUser());

  // console.log("Redirecting now...");
  // setTimeout(() => {
  //     window.location.href = "/";
  // }, 500);
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("Access token expired. Attempting refresh...");

      const dispatch = store.dispatch;
      const success = await refreshAccessToken(dispatch);
      if (!success) return Promise.reject(error);

      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);

export default api;
