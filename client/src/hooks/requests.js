import axios from "axios";
const baseurl = "v1";
// const baseurl = "https://localhost:5000/v1";
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function httpGetPlanets() {
  const response = await fetch(`${baseurl}/planets`);
  console.log("response ", response);
  return await response.json();
  // Load planets and return as JSON.
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
    console.log("launchSpx", launchSpx);
  }
}
async function httpGetLaunches() {
  // await populateLaunches();
  const response = await fetch(`${baseurl}/launches`);
  const fetchdLaunches = await response.json();
  return fetchdLaunches.sort((a, b) => a.flightNumber - b.flightNumber); // Load launches, sort by flight number, and return as JSON.
}

async function httpSubmitLaunch(launch) {
  try {
    const response = await fetch(`${baseurl}/launches`, {
      headers: {
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify(launch),
    });
    return response;
  } catch (e) {
    return {
      ok: false,
    };
  }

  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  console.log("httpAbortLaunchhttpAbortLaunch", id);
  try {
    return await fetch(`${baseurl}/launches/${id}`, {
      method: "delete",
    });
  } catch (e) {
    console.log("err", e);
    return {
      ok: false,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
