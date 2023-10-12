const { asyncFetch } = require("../Util/asyncFetch");
const cache = require('../Data/Cache');


exports.setHeader = (req,res,next) =>{
  if( !cache.clients.has(res)){
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    cache.clients.add(res);
  }
  next();
}
// /sse/matches
exports.getLiveScoreUpdates = (req,res) =>{

  const sendUpdate = async () =>{
    //stop loop interval if res isnt a client -> doenst have set headers 
    if(!cache.clients.has(res)){
      clearInterval(updateInterval);
    }
    try{
      let liveMatches = await asyncFetch(`${cache.url}/api/nfl/matches`);
      //send update if there is ones
      if(JSON.stringify(liveMatches) != JSON.stringify(cache.prevLiveMatches)){
        cache.prevLiveMatches = liveMatches;
        res.write(`data: ${JSON.stringify(liveMatches)}\n\n`);
      }
    }catch(error){
      console.log('sse30');
      console.log(error);
    }
  };
  const updateInterval = setInterval(sendUpdate, 10000 / 4);

  req.on("close", () => {
    clearInterval(updateInterval);
    cache.clients.delete(res); 
    res.end(); 
  });

};
// sse/plays/gameId;
exports.getLivePlayUpdates = (req,res)=>{
  let gameId = req.params.gameId;
 
  const sendUpdate = async () =>{
    //stop loop interval if res isnt a client -> doenst have set headers 
    if(!cache.clients.has(res)){
      clearInterval(updateInterval);
    }
    try{
      let livePlays = await asyncFetch(`${cache.url}/api/nfl/game/${gameId}`);
      //send update if there is ones
      if(JSON.stringify(liveMatches) != JSON.stringify(cache.prevLiveMatches)){
        cache.prevLiveMatches = liveMatches;
        res.write(`data: ${JSON.stringify(liveMatches)}\n\n`);
      }
    }catch(error){
      console.log('sse60');
      console.log(error);
    }
  };
  const updateInterval = setInterval(sendUpdate, 10000 / 4);

  req.on("close", () => {
    clearInterval(updateInterval);
    cache.clients.delete(res); 
    res.end(); 
  });
}