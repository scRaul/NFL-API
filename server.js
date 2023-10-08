require("dotenv").config;
const express = require("express");
const path = require("path");
const server = express();
const { asyncFetch } = require("./Util/asyncFetch");

//templating language ejs
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "Views"));
server.use(express.static("Public"));
// Store active SSE clients in a Set
const activeClients = new Set();

// SSE route to listen for live score updates
server.get("/sse", (req, res) => {
  let url = "http://localhost:8080";
  // Set SSE headers
  if (!activeClients.has(res)) {
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    activeClients.add(res);
  }

  // Function to send live score updates
  const sendLiveScoreUpdate = async () => {
    try {
      if (!activeClients.has(res)) {
        // The client is no longer active, stop sending updates
        clearInterval(updateInterval);
        return;
      }

      // Fetch live score data from your API
      const liveScore = await asyncFetch(`${url}/api/nfl/scores`);
      if (liveScore) {
        // Send the data as an SSE event
        res.write(`data: ${JSON.stringify(liveScore)}\n\n`);
      }
    } catch (error) {
      console.error("Error fetching live score:", error);
    }
  };
 //10s / 2 == 5 s
  const updateInterval = setInterval(sendLiveScoreUpdate, 10000 / 2);

  // Handle client disconnection
  req.on("close", () => {
    clearInterval(updateInterval);
    activeClients.delete(res); 
    res.end(); 
  });
});
let currentWeek;
//routes
server.get("/", async (req, res) => {
  try {
    let url = "http://localhost:8080";
    let matchData = await asyncFetch(`${url}/api/nfl/scores`);
    currentWeek = matchData[0].week;
    if (!matchData) {
      throw new Error("api not available");
    } else {
      res.render("Pages/index", { matchData });
    }
  } catch (error) {
    console.error(error);
    res.render("Pages/404");
  }
});

server.get("/:num", async (req,res) =>{
  let num = req.params.num;
  if( num == currentWeek){
    res.redirect('/');
  }
  try {
    let url = "http://localhost:8080";
    let matchData = await asyncFetch(`${url}/api/nfl/scores/${num}`);
    if (!matchData) {
      throw new Error("api not available");
    } else {
      res.render("Pages/week", { matchData:matchData,currentWeek:currentWeek,week:num });
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
