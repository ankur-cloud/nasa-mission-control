const fs = require("fs");
const path = require("path");
const launchesDB = require("./launches.mongo");
const planets = require("./planets.mongo");

const launches = new Map();

const DFAUULT_FLIGHT_NUMBER = 100;

const launch = {
  flightNumber: 100,
  mission: "Ankur's Mission",
  rocket: "Explorer Is1",
  launchDate: new Date("December 21, 2026"),
  target: "Kepler-1652 b",
  customers: ["Ankur Srivastava", "ISRO"],
  upcoming: true,
  success: true,
};
// launches.set(launch.flightNumber, launch);

async function existLaunchId(id) {
  return await launchesDB.findOne({
    flightNumber: id,
  });
}

async function getLatestFlightNumber(id) {
  const latestLaunch = await launchesDB.findOne().sort("-flightNumber");
  return latestLaunch.flightNumber ?? DFAUULT_FLIGHT_NUMBER;
}

async function getAllLaunches() {
  return await launchesDB.find(
    {},
    {
      _id: 0,
      __v: 0,
    }
  );
}

async function scheduleNewLaunch(currentLaunch) {
  let lastN = (await getLatestFlightNumber()) + 1;

  const newLaunch = {
    ...currentLaunch,
    flightNumber: lastN,
    customers: ["Ankur Srivastava", "ISRO"],
    upcoming: true,
    success: true,
  };
  await saveLaunch(newLaunch);
}

async function saveLaunch(currentLaunch) {
  const findPlanet = await planets.findOne({
    keplerName: currentLaunch.target,
  });
  console.log("findPlanet", findPlanet);
  if (!findPlanet) {
    throw new Error("No matching planet was found");
  }
  await launchesDB.findOneAndUpdate(
    {
      flightNumber: currentLaunch.flightNumber,
    },
    currentLaunch,
    { upsert: true }
  );
}

async function deleteLaunchSequence(launchId) {
  const aborted = await launchesDB.updateOne(
    {
      flightNumber: launchId,
    },
    {
      upcoming: false,
      success: false,
    }
  );
  console.log("abortedaborted", aborted);
  return aborted.modifiedCount === 1;
}

module.exports = {
  existLaunchId,
  getAllLaunches,
  scheduleNewLaunch,
  deleteLaunchSequence,
};
