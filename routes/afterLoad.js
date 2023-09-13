const express = require('express');
const router = express.Router();

router.post('/', async function(req, res, next) {
  try {
    let body = req.body;
    let requestId = body["id"];
    
    let loadDuration = body["duration"];
    let loadResult = body["result"];
    
    console.log('Receive after load url for request ' + requestId + ': duration = ' + loadDuration + ", result = " + loadResult); 
    res.sendStatus(200);
  } catch (err) {
    console.error(`Error while processing after load url `, err.message);
    next(err);
  }
});

module.exports = router;