const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
      ("mongodb+srv://parikshit:9JLh0yQ0cYBynwa5@parikshit.dhozzlt.mongodb.net/Parikshit")
    );
};

module.exports = connectDB;