const baseurl = "http://localhost:5000/v1";

async function httpGetPlanets() {
  const response = await fetch(`${baseurl}/planets`);
  return await response.json();
  // Load planets and return as JSON.
}

async function httpGetLaunches() {
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
