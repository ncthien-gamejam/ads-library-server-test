const express = require('express');
const router = express.Router();

var fsp = require('fs/promises');

const minify = require("html-minifier").minify;

router.get('/', async function(req, res, next) {
  try {
    const adData = await fsp.readFile('./data/banner.html');
    const adString = adData.toString();
    
    const adStringFinal = minify(adString, {
      collapseWhitespace: true,
      removeComments: true,
      minifyJS: true
    });
      
    let ret = {a: 1}
    ret["html"] = adStringFinal;
    
    res.json(ret);
  } catch (err) {
    console.error(`Error while processing ad request `, err.message);
    next(err);
  }
});

module.exports = router;