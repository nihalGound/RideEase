import express from "express";
import { WebSocketServer } from "ws";
import geolib from "geolib";

const app = express();
const PORT = 3000;

let drivers = {};

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (ws) => {
  ws.on("message", (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === "locationUpdate" && data.role === "driver") {
        drivers[data.driver] = {
          latitude: data.data.latitude,
          longitude: data.data.longitude,
        };
      }
      if (data.type === "requestRide" && data.role === "user") {
        const nearByDrivers = findNearbyDrivers(data.latitude, data.longitude);
        ws.send(
          JSON.stringify({ type: "nearbyDrivers", drivers: nearByDrivers })
        );
      }
    } catch (error) {
      console.log("Failed to parse WebSocket message:", error);
    }
  });
});

const findNearbyDrivers = (userLat, userLon) => {
  return Object.entries(drivers)
    .filter(([id, location]) => {
      const distance = geolib.getDistance(
        { latitude: userLat, longitude: userLon },
        location
      );
      return distance <= 5000; // 5 kilometers
    })
    .map(([id, location]) => ({ id, ...location }));
};

app.listen(PORT, () => {
  console.log(`Socket server is running on port ${PORT}`);
});
