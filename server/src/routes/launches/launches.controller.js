const {
  existLaunchId,
  getAllLaunches,
  addNewLaunch,
  deleteLaunchSequence,
} = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
  return res.status(200).json(getAllLaunches());
}

function httpAddNewLaunch(req, res) {
  console.log("httpAddNewLaunch", req.body);
  const launch = req.body;

  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "One or more inputs not provided",
    });
  }
  launch.launchDate = new Date(launch.launchDate);

  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Invalid date",
    });
  }
  addNewLaunch(launch);
  return res.status(201).json(launch);
}

function httpAbortaunch(req, res) {
  console.log("httpAbortaunch", req.params);
  const launchId = Number(req.params.id);
  console.log("launchId", launchId);
  console.log("existLaunchId(launchId)", existLaunchId(launchId));
  if (!existLaunchId(launchId)) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }
  const abortedLaunch = deleteLaunchSequence(launchId);
  console.log("abortedLaunch", abortedLaunch);
  return res.status(200).json(abortedLaunch);
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortaunch };
