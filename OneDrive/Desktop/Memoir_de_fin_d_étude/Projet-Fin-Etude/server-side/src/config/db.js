const mongoose = require("mongoose");

const connectDB = async (uri) => {
    try {
        await mongoose.connect(uri);
        console.log("DATABASE is connected ...");
    } catch (error) {
        console.log("Error connecting to DATABASE:", error);
    }
}

module.exports = connectDB;