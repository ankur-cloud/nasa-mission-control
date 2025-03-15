const request = require("supertest");
const app = require("../../app");
const { mongoConnect, mongoDisconnect } = require("../../../services/mongo");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test GET /v1/launches", () => {
    test("It should respond with 200 success", async () => {
      const response = await request(app)
        .get("/v1/launches")
        .expect("Content-Type", /json/)
        .expect(200);
    });
  });

  describe("Test POST /v1/launches", () => {
    const completeLaunchData = {
      mission: "IND Enterprise",
      rocket: "AKR z1",
      target: "Kepler-296 A e",
      launchDate: "Jan 4, 2027",
    };

    const launchDataWithoutDate = {
      mission: "IND Enterprise",
      rocket: "AKR z1",
      target: "Kepler-296 A e",
    };

    const postObjWithInvalidDate = {
      mission: "IND Enterprise",
      rocket: "AKR z1",
      target: "IND Enterprise",
      launchDate: "golu",
    };

    test("It should respond with 201 success", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(completeLaunchData)
        .expect("Content-Type", /json/)
        .expect(201);

      const requestDate = new Date(completeLaunchData.launchDate).valueOf();
      const responseDate = new Date(response.body.launchDate).valueOf();
      expect(responseDate).toBe(requestDate);

      expect(response.body).toMatchObject(launchDataWithoutDate);
    });

    test("It should catch missing required properties", async () => {
      const response = await request(app)
        .post("/v1/launches")
        .send(launchDataWithoutDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(response.body).toStrictEqual({
        error: "One or more inputs not provided",
      });
    });

    test("It should catch invalid dates", async () => {
      const respons = await request(app)
        .post("/v1/launches")
        .send(postObjWithInvalidDate)
        .expect("Content-Type", /json/)
        .expect(400);

      expect(respons.body).toStrictEqual({
        error: "Invalid date",
      });
    });
  });
});
