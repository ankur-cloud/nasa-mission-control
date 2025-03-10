const { getAllPlanets } = require("../../models/planets.model");

async function httpGetAllPlanets(req, res) {
  const allPlanets = await getAllPlanets();
  return await res.status(200).json(allPlanets);
}
module.exports = { httpGetAllPlanets };
