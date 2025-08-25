const mongoose = require("mongoose");

require('dotenv').config();
 
const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once("open", () => {
  console.log("MongoDb konnection ready");
});

// mongoose connection is an event emitter 
// collection made up of one or many documents 
mongoose.connection.on("error", (err) => {
  console.error("MongoDb konnection error", err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect(MONGO_URL);
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
