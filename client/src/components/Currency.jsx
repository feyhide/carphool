import { useState, useRef } from "react";
import { Button } from "./Button";
import { validCurrencyCodes } from "../utils/utility.js";
import api from "../utils/refresher.js";
import { DOMAIN } from "../utils/constant.js";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addCurrencyPreference } from "../redux/userSlice.js";
import { useNavigate } from "react-router-dom";

const Currency = () => {
  const [currencies, setCurrencies] = useState(validCurrencyCodes);
  const { currentUser } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleCurrencyChange = (code) => {
    setSelectedCurrency(code);
    setIsOpen(false);
  };

  const handleSetCurrency = async () => {
    setLoading(true);
    try {
      const { data } = await api.post(
        DOMAIN + "user/set-currency",
        { code: selectedCurrency },
        { withCredentials: true }
      );

      if (data.success) {
        dispatch(addCurrencyPreference(selectedCurrency));
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data.message || "an error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-5 items-center justify-center primary relative">
      <h1 className="text-3xl">Select Your Currency</h1>
      {currentUser.currencyPreference && (
        <p>Your current preference : {currentUser.currencyPreference}</p>
      )}
      <div className="relative w-1/2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="border p-2 rounded w-full text-left"
        >
          {selectedCurrency ? `${selectedCurrency}` : "Select a Currency"}
        </button>

        {isOpen && (
          <ul
            ref={dropdownRef}
            className="absolute top-full mt-1 w-full max-h-60 overflow-y-auto bg-white border shadow-md z-40"
            style={{ maxHeight: "200px", overflowY: "auto" }}
          >
            {currencies.map((currency, index) => (
              <li
                key={index}
                onClick={() => handleCurrencyChange(currency.code)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {currency.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <Button
        text={loading ? "Submitting..." : "Submit"}
        responsive={true}
        onClickState={loading}
        onClick={handleSetCurrency}
        bgColor={"black"}
        textBefColor={"#ffffff"}
        textAfterColor={"#000000"}
      />
    </div>
  );
};

export default Currency;
