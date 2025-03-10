const http = require("http");
const { isMainThread, workerData, Worker } = require("worker_threads");
const app = require("./app");
const { getAllPlanets } = require("./models/planets.model");
const { mongoConnect } = require("../services/mongo");

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// if (isMainThread) {
//   console.log("Main thread process ID", process.pid);
//   new Worker(__filename, {
//     workerData: [7, 2, 4, 1],
//   });

//   new Worker(__filename, {
//     workerData: [1, 3, 4, 3],
//   });
// } else {
//   console.log("Worker Process Id", process.pid);
//   console.log(workerData, "sorted if=s", workerData.sort());
// }

async function startServer() {
  await mongoConnect();
  await getAllPlanets();
}

startServer();
server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
