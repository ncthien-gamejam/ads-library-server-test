import express from 'express';
const router = express.Router();

router.post('/', async function(req, res, next) {
  try {
    let body = req.body;
    let requestId = body["id"];
    
    console.log('Receive rewarded completion url for request ' + requestId); 
    res.sendStatus(200);
  } catch (err) {
    console.error(`Error while processing rewarded completion url `, err.message);
    next(err);
  }
});

export { router }