const express = require('express');
const router = express.Router();

var fsp = require('fs/promises');

const minify = require("html-minifier").minify;

function createClickUrl(baseUrl, requestId)
{
  return baseUrl + "/click?request_id=" + requestId;
}

function createImpressionUrl(baseUrl, requestId)
{
  return baseUrl + "/impression?request_id=" + requestId;
}

function createRewardedAdCompletionUrl(baseUrl, requestId)
{
  return baseUrl + "/rewarded_complete?request_id=" + requestId;
}

async function createAdData(adFormat, adUnitId, baseUrl, requestId)
{
  let filename = '';
  
  if (adFormat === "banner") filename = 'banner.html';
  else if (adFormat === "interstitial") filename = 'interstitial.html';
  else if (adFormat === "rewarded_ad") filename = 'rewarded.html';
  
  const adData = await fsp.readFile('./data/' + filename);
  const adString = adData.toString();
  
  const adStringFinal = minify(adString, {
    collapseWhitespace: true,
    removeComments: true,
    minifyJS: true
  });
  
  
  let clickUrls = [createClickUrl(baseUrl, requestId)];
  let impressionUrls = [createImpressionUrl(baseUrl, requestId)];
  
  let meta = {};
    
  if (adFormat == "interstitial")
  {
    let settings = {};
    settings['max-exp-time']=0;
    settings['min-time']=5000;
    settings['countdown-timer-delay']=0;
    settings['show-countdown-timer']=true;
    
    let endCard = {}
    endCard['static-min-time']=0;
    endCard['interactive-min-time']=0;
    endCard['static-duration']=0;
    endCard['interactive-duration']=0;
    endCard['countdown-timer-delay']=0;
    endCard['show-countdown-timer']=true;
    
    settings['end-card']=endCard;
    
    meta['ad-settings'] = settings;
  }
  else if (adFormat == "rewarded_ad")
  {
    let settings = {};
    settings['max-exp-time']=0;
    settings['min-time']=10000;
    settings['countdown-timer-delay']=0;
    settings['show-countdown-timer']=true;
    
    let endCard = {}
    endCard['static-min-time']=0;
    endCard['interactive-min-time']=0;
    endCard['static-duration']=5000;
    endCard['interactive-duration']=10000;
    endCard['countdown-timer-delay']=0;
    endCard['show-countdown-timer']=true;
    
    settings['end-card']=endCard;
    
    meta['ad-settings'] = settings;
    
    let reward = {};
    reward['completion-url'] = createRewardedAdCompletionUrl(baseUrl, requestId);
    reward['item'] = 'gem';
    reward['amount'] = 100;
    
    meta['ad-reward'] = reward;
  }
  
  meta["network-type"] = "superfine";
  meta["ad-type"] = "html";
  meta["ad-group-id"] = "AD_GROUP_ID_TEST";
  meta["dsp-creative-id"] = "CREATIVE_ID_TEST";
  
  meta["refresh-time"] = 60 * 1000; //ms (1m)
  
  meta["ad-timeout"] = 30 * 1000; //ms (30s)
  
  meta["orientation"] = "portrait";
  meta["width"] = 468;
  meta["height"] = 60;
  
  let numClickUrls = clickUrls.length;
  if (numClickUrls > 0)
  {
    if (numClickUrls == 1)
    {
      meta["click-url"] = clickUrls[0];
    }
    else
    {
      meta["click-urls"] = clickUrls;
    }
  }
  
  let numImpressionUrls = impressionUrls.length;
  if (numImpressionUrls > 0)
  {
    if (numImpressionUrls == 1)
    {
      meta["impression-url"] = impressionUrls[0];
    }
    else
    {
      meta["impression-urls"] = impressionUrls;
    }
  }
  
  let ret = {};
  
  ret["content"] = adStringFinal;
  ret["metadata"] = meta;
  
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

router.post('/', async function(req, res, next) {
  try {
    let body = req.body;
    
    let adFormat = body["ad-format"];
    let adUnitId = body["ad-unit-id"];
    
    let baseUrl = req.protocol + '://' + req.get('host');
    
    let ret = {}
    
    let requestId = getUniqueId();
    
    ret["request-id"] = requestId;
    
    let adResponses = [];
    adResponses.push(await createAdData(adFormat, adUnitId, baseUrl, requestId));
    
    ret["ad-responses"] = adResponses;
    
    res.json(ret);
  } catch (err) {
    console.error(`Error while processing ad request `, err.message);
    next(err);
  }
});

module.exports = router;