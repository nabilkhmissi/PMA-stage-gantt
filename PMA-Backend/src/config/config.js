require("dotenv").config();
module.exports = {
    PORT: process.env.PORT,
    CONNECTION_STRING: process.env.CONNECTION_STRING,
    EMAIL: process.env.EMAIL,
    API_URL: process.env.API_URL,
    PASSWORD: process.env.PASSWORD,
    NODE_ENV: process.env.NODE_ENV
}