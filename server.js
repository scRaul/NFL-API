require("dotenv").config;
const express = require("express");
const path = require("path");
const server = express();

//templating language ejs
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "Views"));
server.use(express.static("Public"));

// SSE route to listen for live score updates
const sseRoute = require('./Routes/sseRoute');
server.use("/sse",sseRoute);

//Client routes
server.get("/",(req,res,next)=>{
  res.redirect('/nfl');
  next();
});
const nflRoute = require('./Routes/nflRoute');
server.use("/nfl",nflRoute);
//API Route 
const apiRoute = require("./Routes/apiRoute");
server.use("/api", apiRoute);


//Error Cather / Handler // we simply send them back to home page
server.use((error,req,res,next)=>{
  const status = error.statusCode || 500; 
  const message = error.message;
  const errors = error.errors? error.errors : [];
  res.status(status).send({status,errors,message});
});



// -- Starting the Server 
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log(`Node Server is listening at localhost:${port}`);
});
