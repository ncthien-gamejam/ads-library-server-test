import express from 'express';
const router = express.Router();

router.post('/:eventName', async function(req, res, next) {
  try {
    console.log('Tracking event: ' + req.params.eventName);
    
    let body = req.body;
    console.log('Receive tracking: ' + JSON.stringify(body)); 
    res.sendStatus(200);
  } catch (err) {
    console.error(`Error while processing tracking url `, err.message);
    next(err);
  }
});

export { router }