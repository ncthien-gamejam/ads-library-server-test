const express = require('express');
const router = express.Router();

router.post('/', async function(req, res, next) {
  try {
    let body = req.body;
    let requestId = body["id"];
    
    console.log('Receive before load url for request ' + requestId); 
    res.sendStatus(200);
  } catch (err) {
    console.error(`Error while processing before load url `, err.message);
    next(err);
  }
});

module.exports = router;