import express from 'express';
const router = express.Router();

router.get('/', async function(req, res, next) {
  try {
    console.log('Receive query: ' + JSON.stringify(req.query)); 
    res.sendStatus(200);
  } catch (err) {
    console.error(`Error while processing OMID verify failed url `, err.message);
    next(err);
  }
});

export { router }