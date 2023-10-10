const { asyncFetch } = require("../Util/asyncFetch");

const url  = "http://localhost:8080";
const activeClients = new Set();
let prevScoreUpdate = undefined;
exports.serveGameScores = (req, res) =>{
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
          clearInterval(updateInterval);
          return;
        }
  
        // Fetch live score data from your API
        const liveScore = await asyncFetch(`${url}/api/nfl/scores`);
        if (liveScore) {
          if (prevScoreUpdate === undefined) {
            prevScoreUpdate = liveScore;
            res.write(`data: ${JSON.stringify(liveScore)}\n\n`);
          } else if (JSON.stringify(prevScoreUpdate) !== JSON.stringify(liveScore)) {
            prevScoreUpdate = liveScore;
            res.write(`data: ${JSON.stringify(liveScore)}\n\n`);
          }
        }
      }  catch (error) {
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
  };


  exports.servePlays = (req, res) =>{
    let gameId = req.params.gameId;
    // Set SSE headers
    if (!activeClients.has(res)) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");
      activeClients.add(res);
    }
  
    // Function to send live score updates
    const sendLivePlayUpdate = async () => {
      try {
        if (!activeClients.has(res)) {
          clearInterval(updateInterval);
          return;
        }
        const livePlays = await asyncFetch(`${url}/api/nfl/game/${gameId}`);
        if (livePlays) {
          res.write(`data: ${JSON.stringify(livePlays)}\n\n`);
        }
      } catch (error) {
        console.error("Error fetching live plays:", error);
      }
    };
   //10s / 2 == 5 s
    const updateInterval = setInterval(sendLivePlayUpdate, 10000 / 2);
    req.on("close", () => {
      clearInterval(updateInterval);
      activeClients.delete(res); 
      res.end(); 
    });
  };