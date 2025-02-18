/* eslint-disable no-unused-vars */
import { Route, Routes, BrowserRouter, Outlet } from "react-router-dom";
import Header from "./components/Header";
import AuthPage from "./pages/AuthPage";
import Home from "./pages/Home";
import React from "react";

const LayoutWithHeader = () => (
  <>
    <Header />
    <Outlet />
  </>
);

const App = () => {
  //console.warn = () => {};
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
          <Route path="/" element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
