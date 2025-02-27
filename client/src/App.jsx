/* eslint-disable no-unused-vars */
import {
  Route,
  Routes,
  BrowserRouter,
  Outlet,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import FindLiveLocation from "./pages/FindLiveLocation";
import { useSelector } from "react-redux";
import React from "react";

const LayoutWithHeader = () => (
  <>
    <Header />
    <Outlet />
  </>
);

const App = () => {
  const currentUser = useSelector((state) => state.user.currentUser);

  const renderHomePage = () => {
    return currentUser &&
      currentUser.liveLocation.lat &&
      currentUser.liveLocation.lon ? (
      <Home />
    ) : (
      <Navigate to="/find-live-location" />
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-up" element={<AuthPage page={"signUp"} />} />
        <Route path="/sign-in" element={<AuthPage page={"signIn"} />} />
        <Route path="/reset-password" element={<AuthPage page={"reset"} />} />
        <Route
          path="/add-currency-preference"
          element={<AuthPage page={"currency"} />}
        />
        <Route element={<LayoutWithHeader />}>
          <Route path="/" element={renderHomePage()} />
        </Route>
        <Route path="/find-live-location" element={<FindLiveLocation />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
