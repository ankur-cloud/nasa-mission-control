const fs = require("fs");
const axios = require("axios");
const path = require("path");
const launchesDB = require("./launches.mongo");
const planets = require("./planets.mongo");

const DFAUULT_FLIGHT_NUMBER = 100;

async function findLaunch(filter) {
  return await launchesDB.findOne(filter);
}

async function existLaunchId(id) {
  return await findLaunch({
    flightNumber: id,
  });
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("Luanch already laoded!");
  } else {
    await populateLaunches();
  }
}

async function populateLaunches() {
  console.log("Downlaoding launch data");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        {
          path: "rocket",
          select: {
            name: 1,
          },
        },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Problem downloading response data");
    throw new Error("Launch data download failed");
  }

  const launchDocs = response.data.docs;
  for (const launchDoc of launchDocs) {
    const payload = launchDoc.payloads;

    const customers = payload.flatMap((x) => {
      return x.customers;
    });

    const launchSpx = {
      flightNumber: launchDoc.flight_number,
      mission: launchDoc.name,
      rocket: launchDoc.rocket.name,
      launchDate: launchDoc.date_local,
      customers, // payload.customers[]
      upcoming: launchDoc.upcoming,
      success: launchDoc.success,
    };
    await saveLaunch(launchSpx);
  }
}

async function getLatestFlightNumber(id) {
  const latestLaunch = await launchesDB.findOne().sort("-flightNumber");
  return latestLaunch.flightNumber ?? DFAUULT_FLIGHT_NUMBER;
}

async function getAllLaunches(skip, limit) {
  return await launchesDB
    .find(
      {},
      {
        _id: 0,
        __v: 0,
      }
    )
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function scheduleNewLaunch(currentLaunch) {
  const findPlanet = await planets.findOne({
    keplerName: currentLaunch.target,
  });

  if (!findPlanet) {
    throw new Error("No matching planet was found");
  }
  let lastFlightNum = (await getLatestFlightNumber()) + 1;

  const newLaunch = {
    ...currentLaunch,
    flightNumber: lastFlightNum,
    customers: ["Ankur Srivastava", "ISRO"],
    upcoming: true,
    success: true,
  };
  await saveLaunch(newLaunch);
}

async function saveLaunch(currentLaunch) {
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
//
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

module.exports = {
  existLaunchId,
  getAllLaunches,
  scheduleNewLaunch,
  deleteLaunchSequence,
  loadLaunchData,
};
