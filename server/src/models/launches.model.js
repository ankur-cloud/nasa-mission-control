const fs = require("fs");
const path = require("path");

const launches = new Map();

const launch = {
  flightNumber: 100,
  mission: "Ankur's Mission",
  rocket: "Explorer Is1",
  launchDate: new Date("December 21, 2026"),
  target: "Jupiter",
  customer: ["Ankur Srivastava", "ISRO"],
  upcoming: true,
  success: true,
};
launches.set(launch.flightNumber, launch);

function existLaunchId(id) {
  return launches.has(id);
}

function getAllLaunches() {
  return Array.from(launches.values());
}

function addNewLaunch(currentLaunch) {
  const lastEntry = [...launches].pop();
  let lastN = lastEntry[1].flightNumber;
  lastN++;
  const tempObj = {
    ...currentLaunch,
    flightNumber: lastN,
    customer: ["Ankur Srivastava", "ISRO"],
    upcoming: true,
    success: true,
  };
  launches.set(lastN, tempObj);
}

function deleteLaunchSequence(launchId) {
  console.log("launchId", launchId);
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;

  return aborted;
  // launches.delete(launchId);
}

module.exports = {
  existLaunchId,
  getAllLaunches,
  addNewLaunch,
  deleteLaunchSequence,
};
