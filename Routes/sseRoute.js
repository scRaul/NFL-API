const express = require("express");
const router = express.Router();
const { asyncFetch } = require("../Util/asyncFetch");


const sseController = require("../Controllers/sseController");


router.get('/scores',sseController.serveGameScores);
router.get('/plays/:gameId',sseController.servePlays);


module.exports = router; 