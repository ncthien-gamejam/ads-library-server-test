import express from 'express';
const router = express.Router();

router.get('/', async function(req, res, next) {
  try {
    let msg = req.query.msg;
    
    msg = decodeURI(msg);
    
    let separatorPos = msg.indexOf("::");
    if (separatorPos < 0)
    {
      console.error(`Unable to parse message `, msg);
    }
    else
    {
      let dateString = msg.substring(0, separatorPos);
      let date = new Date(dateString);
      
      console.log('Time: ' + date.toString()); 
      
      let data = JSON.parse(msg.substring(separatorPos + 2));
      console.log('Data: ' + JSON.stringify(data)); 
    }
    res.sendStatus(200);
  } catch (err) {
    console.error(`Error while processing OMID verify url `, err.message);
    next(err);
  }
});

export { router }