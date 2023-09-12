const express = require('express');
const router = express.Router();

router.post('/', async function(req, res, next) {
  try {
    let body = req.body;
    let requestId = body["request_id"];
    
    console.log('Receive impression url for request ' + requestId); 
    res.sendStatus(200);
  } catch (err) {
    console.error(`Error while processing impression url `, err.message);
    next(err);
  }
});

module.exports = router;