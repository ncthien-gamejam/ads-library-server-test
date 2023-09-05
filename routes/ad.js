const express = require('express');
const router = express.Router();

router.get('/', async function(req, res, next) {
  try {
    let ret = {a: 1}
    res.json(ret);
  } catch (err) {
    console.error(`Error while processing ad request `, err.message);
    next(err);
  }
});

module.exports = router;