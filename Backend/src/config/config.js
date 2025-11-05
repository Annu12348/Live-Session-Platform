import dotenv from "dotenv";
dotenv.config();

export const config = {
    PORT: process.env.PORT,
    MONGODB_URL: process.env.MONGODB_URL,
}