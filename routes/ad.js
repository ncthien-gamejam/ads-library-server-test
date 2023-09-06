const express = require('express');
const router = express.Router();

var fsp = require('fs/promises');

const minify = require("html-minifier").minify;

async function createAdData()
{
  const adData = await fsp.readFile('./data/banner.html');
  const adString = adData.toString();
  
  const adStringFinal = minify(adString, {
    collapseWhitespace: true,
    removeComments: true,
    minifyJS: true
  });
  
  let clickUrls = [];
  let impressionUrls = [];
  
  let meta = {};
  meta["network-type"] = "superfine";
  meta["ad-type"] = "html";
  meta["ad-group-id"] = "AD_GROUP_ID_TEST";
  meta["dsp-creative-id"] = "CREATIVE_ID_TEST";
  
  meta["refresh-time"] = 60 * 1000; //ms (1m)
  
  meta["ad-timeout"] = 30 * 1000; //ms (30s)
  
  meta["orientation"] = "portrait";
  meta["width"] = 468;
  meta["height"] = 60;
  
  if (clickUrls.length > 0)
  {
    meta["click-urls"] = clickUrls;
  }
  
  if (impressionUrls.length > 0)
  {
    meta["impression-urls"] = impressionUrls;
  }
  
  let ret = {};
  ret["content"] = adStringFinal;
  ret["meta"] = meta;
  
  return ret;
}

function getUniqueId()
{
    if (typeof getUniqueId.counter == 'undefined' )
    {
        getUniqueId.counter = 0;
    }

    let ret = ++getUniqueId.counter;
    return ret;
}

router.get('/', async function(req, res, next) {
  try {
    let ret = {}
    
    let requestId = getUniqueId();
    
    ret["request-id"] = requestId;
    
    let adResponses = [];
    adResponses.push(await createAdData());
    
    ret["ad-responses"] = adResponses;
    
    res.json(ret);
  } catch (err) {
    console.error(`Error while processing ad request `, err.message);
    next(err);
  }
});

module.exports = router;