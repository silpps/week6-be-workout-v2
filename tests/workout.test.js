const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const User = require("../models/userModel");
const Workout = require("../models/workoutModel");
const workouts = require("./data/workouts.js");

let token = null;

beforeAll(async () => {
  await User.deleteMany({});
  const result = await api
    .post("/api/user/signup")
    .send({ email: "mattiv@matti.fi", password: "R3g5T7#gh" });
  token = result.body.token;
});

      beforeEach(async () => {
        await Workout.deleteMany({});
        await api
        .post("/api/workouts")
        .set("Authorization", "bearer " + token)
        .send(workouts[0])
        .send(workouts[1]);
  });

  describe("GET /api/workouts", () => {
    test("should return workouts in JSON format", async () => {
      await api
        .get("/api/workouts")
        .set("Authorization", "bearer " + token)
        .expect(200)
        .expect("Content-Type", /application\/json/);
  })});

  describe("POST /api/workout", () => {
    test("should add a new workout successfully", async () => {
      const newWorkout = {
        title: "testworkout",
        reps: 10,
        load: 100,
    };
    await api
      .post("/api/workouts")
      .set("Authorization", "bearer " + token)
      .send(newWorkout)
      .expect(201);
  });
});


describe("DELETE /api/workouts/:id", () => {
  test("should delete a workout successfully", async () => {
    // Create a new workout
    const newWorkout = {
      title: "testworkout",
      reps: 10,
      load: 100,
    };
    const createdWorkout = await api
      .post("/api/workouts")
      .send(newWorkout)
      .set("Authorization", "bearer " + token);

    // Delete the workout
    await api
      .delete(`/api/workouts/${createdWorkout.body._id}`)
      .set("Authorization", "bearer " + token)
      .expect(204);

    // Verify the workout is deleted
    await api
      .get(`/api/workouts/${createdWorkout.body._id}`)
      .set("Authorization", "bearer " + token)
      .expect(404);
  });
});

describe ("PATCH /api/workouts/:id", () => {
  test("should update a workout successfully", async () => {
    // Create a new workout
    const newWorkout = {
      title: "testworkout",
      reps: 10,
      load: 100,
    };
    const createdWorkout = await api
      .post("/api/workouts")
      .send(newWorkout)
      .set("Authorization", "bearer " + token);

    // Update the workout
    const updatedWorkout = {
      title: "updated workout",
      reps: 20,
      load: 200,
    };
    await api
      .patch(`/api/workouts/${createdWorkout.body._id}`)
      .send(updatedWorkout)
      .set("Authorization", "bearer " + token)
      .expect(200);

    // Verify the workout is updated
    const response = await api
      .get(`/api/workouts/${createdWorkout.body._id}`)
      .set("Authorization", "bearer " + token)
      .expect(200);
    expect(response.body.title).toBe("updated workout");
    expect(response.body.reps).toBe(20);
    expect(response.body.load).toBe(200);
  });
});

describe("GET /api/workouts/:id", () => {
  test("should return a workout in JSON format", async () => {
    const newWorkout = {
      title: "testworkout",
      reps: 10,
      load: 100,
    };
    const createdWorkout = await api
      .post("/api/workouts")
      .send(newWorkout)
      .set("Authorization", "bearer " + token);

    await api
      .get(`/api/workouts/${createdWorkout.body._id}`)
      .set("Authorization", "bearer " + token)
      .expect(200)
      .expect("Content-Type", /application\/json/);
  });
});



afterAll(() => {
  mongoose.connection.close();
});
