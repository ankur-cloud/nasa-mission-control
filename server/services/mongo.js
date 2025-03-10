const mongoose = require("mongoose");

const MONGO_URL = `mongodb+srv://ankur-x:SpFhKXSNTRnxJNmx@node-js-me.zusvi.mongodb.net/sattelite?retryWrites=true&w=majority&appName=node-js-me`;

mongoose.connection.once("open", () => {
  console.log("MongoDb konnection ready");
});
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
