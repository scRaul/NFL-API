require("dotenv").config;
const express = require("express");
const path = require("path");
const server = express();
const { asyncFetch } = require("./Util/asyncFetch");

//templating language ejs
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "Views"));
server.use(express.static("Public"));

// SSE route to listen for live score updates
server.get("/sse", (req, res) => {
  let url = "http://localhost:8080";
  const resStream = res;

  // Set SSE headers
  resStream.setHeader("Content-Type", "text/event-stream");
  resStream.setHeader("Cache-Control", "no-cache");
  resStream.setHeader("Connection", "keep-alive");

  // Function to send live score updates
  const sendLiveScoreUpdate = async () => {
    try {
      // Fetch live score data from your API
      const liveScore = await asyncFetch(`${url}/api/nfl/scores`);
      if (liveScore) {
        // Send the data as an SSE event
        resStream.write(`data: ${JSON.stringify(liveScore)}\n\n`);
      }
    } catch (error) {
      console.error("Error fetching live score:", error);
    }
  };

  // Send updates every 10 seconds (adjust the interval as needed)
  const updateInterval = setInterval(sendLiveScoreUpdate, 10000);

  // Handle client disconnection
  req.on("close", () => {
    clearInterval(updateInterval);
    resStream.end(); // Ensure the response stream is closed
  });
});

//routes
server.get("/", async (req, res) => {
  try {
    let url = "http://localhost:8080";
    let matchData = await asyncFetch(`${url}/api/nfl/scores`);
    if (!matchData) {
      throw new Error("api not available");
    } else {
      res.render("Pages/home", { matchData });
    }
  } catch (error) {
    console.error(error);
    res.render("Pages/404");
  }
});

const apiRoute = require("./Routes/apiRoute");
const { match } = require("assert");
server.use("/api", apiRoute);

const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Node Server is listening at localhost:${port}`);
});
