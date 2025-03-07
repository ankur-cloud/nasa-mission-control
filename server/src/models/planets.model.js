const fs = require("fs");
const path = require("path");

const { parse } = require("csv-parse");

const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

// new Promise

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", (data) => {
        if (isHabitablePlanet(data)) {
          habitablePlanets.push(data);
        }
      })
      .on("error", (err) => {
        console.log("loadPlanetsData err", err);
        reject(err);
      })
      .on("end", () => {
        const planetNames = habitablePlanets.map(
          (planet) => planet["kepler_name"]
        );
        resolve();
        console.log("planetNames", planetNames);
      });
  });
}

module.exports = { loadPlanetsData, planets: habitablePlanets };
