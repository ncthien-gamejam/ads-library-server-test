import express from 'express';
const router = express.Router();

router.get('/', async function(req, res, next) {
  try {
    let msg = req.query.msg;
    
    let data = JSON.parse(decodeURI(msg));
    
    console.log('Receive data: ' + JSON.stringify(data)); 
    res.sendStatus(200);
  } catch (err) {
    console.error(`Error while processing OMID verify url `, err.message);
    next(err);
  }
});

export { router }