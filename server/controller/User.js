import User from "../model/User.js";
import {
  sendError,
  sendSuccess,
  sendValidationError,
} from "../utils/response.js";
import { validCurrencyCodes } from "../utils/utility.js";

export const setCurrency = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return sendError(res, "Currency code is required.", null, 400);
  }

  const isValidCurrency = validCurrencyCodes.find(
    (currency) => currency.code === code
  );

  if (!isValidCurrency) {
    return sendError(res, "Invalid currency code.", null, 400);
  }

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return sendError(res, "User not found.", null, 404);
    }

    user.currencyPreference = code;

    await user.save();
    return sendSuccess(res, "Currency preference updated successfully");
  } catch (error) {
    //console.error(error);
    return sendError(res, "Internal Server Error.", null, 500);
  }
};
