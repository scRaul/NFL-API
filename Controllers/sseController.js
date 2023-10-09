const { asyncFetch } = require("../Util/asyncFetch");

const activeClients = new Set();


exports.handleEvents = (req, res) =>{
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
  };