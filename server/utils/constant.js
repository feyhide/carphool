import dotenv from "dotenv";
dotenv.config();

let prod = false;

export const client = prod ? process.env.ORIGIN_PRODUCTION : process.env.ORIGIN;
