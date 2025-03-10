const {
  existLaunchId,
  getAllLaunches,
  scheduleNewLaunch,
  deleteLaunchSequence,
} = require("../../models/launches.model");

async function httpGetAllLaunches(req, res) {
  return res.status(200).json(await getAllLaunches());
}

async function httpAddNewLaunch(req, res) {
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
  await scheduleNewLaunch(launch);
  console.log("launchlaunchlaunch", launch);
  return res.status(201).json(launch);
}

async function httpAbortaunch(req, res) {
  console.log("httpAbortaunch", req.params);
  const launchId = Number(req.params.id);

  const ifExistLaunch = await existLaunchId(launchId);
  if (!ifExistLaunch) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }
  const abortedLaunch = await deleteLaunchSequence(launchId);
  console.log("abortedLaunch", abortedLaunch);
  if (!abortedLaunch) {
    return res.status(400).json({
      error: "Launch not aborted",
    });
  }
  return res.status(200).json({
    ok: true,
  });
}

module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortaunch };
