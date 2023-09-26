import express from 'express';
const router = express.Router();

router.post('/', async function(req, res, next) {
  try {
    let body = req.body;
    
    console.log('Receive error: ' + JSON.stringify(body)); 
    res.sendStatus(200);
  } catch (err) {
    console.error(`Error while processing error url `, err.message);
    next(err);
  }
});

export { router }