const express = require('express');
const router = express.Router();

var fsp = require('fs/promises');

const minify = require("html-minifier").minify;

function createClickUrl(baseUrl, requestId)
{
  return baseUrl + "/click?id=" + requestId;
}

function createImpressionUrl(baseUrl, requestId)
{
  return baseUrl + "/impression?id=" + requestId;
}

function createRewardedAdCompletionUrl(baseUrl, requestId)
{
  return baseUrl + "/rewarded_complete?id=" + requestId;
}

function createBeforeLoadUrl(baseUrl, requestId)
{
  return baseUrl + "/before_load?id=" + requestId;
}

function createAfterLoadUrl(baseUrl, requestId)
{
  return baseUrl + "/after_load?id=" + requestId + "&duration=%%LOAD_DURATION%%&result=%%LOAD_RESULT%%";
}

async function createAdData(requestBody, adFormat, adUnitId, baseUrl, requestId)
{
  let width = 0;
  let height = 0;
  
  let orientation = requestBody['orientation'];
  
  let filename = '';
  
  let loadTimeout = 0;
  
  if (adFormat === "banner")
  {
    filename = 'banner.html';
    
    width = 320;
    height = 41;
    
    loadTimeout = 10000; //ms (10s)
  }
  else if (adFormat === "interstitial")
  {
    filename = 'interstitial.html';
    
    width = requestBody['width'];
    height = requestBody['height'];
    
    loadTimeout = 30000; //ms (30s)
  }
  else if (adFormat === "rewarded_ad")
  {
    filename = 'rewarded.html';
    
    width = requestBody['width'];
    height = requestBody['height'];
    
    loadTimeout = 30000; //ms (30s)
  }
  
  let adType = 'html';
  
  let adGroupId = "AD_GROUP_ID_TEST";
  let creativeId = "CREATIVE_ID_TEST";
  
  let networkName = "superfine";
  
  let networkPlacementId = "NETWORK_PLACEMENT_ID_TEST";
  
  let userSegment = "default";
  
  let country = "US"; //ISO 3166-1 alpha-2
  let currency = "USD"; //ISO 4217
  
  let revenue = 0.01;
  
  let precisionType = "estimated";
  
  let demandPartnerData = {'encrypted_cpm': 'test_cpm'};
 
  const adData = await fsp.readFile('./data/' + filename);
  const adString = adData.toString();
  
  const adStringFinal = minify(adString, {
    collapseWhitespace: true,
    removeComments: true,
    minifyJS: true
  });
    
  let clickUrls = [createClickUrl(baseUrl, requestId)];
  let impressionUrls = [createImpressionUrl(baseUrl, requestId)];
  
  let beforeLoadUrls = [createBeforeLoadUrl(baseUrl, requestId)];
  let afterLoadUrls = [createAfterLoadUrl(baseUrl, requestId)];
  
  let meta = {};
    
  if (adFormat == "rewarded_ad")
  {
    let rewardSettings = {};
    rewardSettings['completion_url'] = createRewardedAdCompletionUrl(baseUrl, requestId);
    rewardSettings['item'] = 'gem';
    rewardSettings['amount'] = 100;
    
    meta['rewarded_settings'] = rewardSettings;
  }
  else if (adFormat == "banner")
  {
    let bannerSettings = {};
    bannerSettings['impression_min_pixels'] = 10000; //dips
    bannerSettings['impression_min_time'] = 3000; //ms (3s)
    bannerSettings["refresh_time"] = 60 * 1000; //ms (1m)
    
    meta['banner_settings'] = bannerSettings;
  }
  
  meta["ad_type"] = adType;
  
  meta["ad_group_id"] = adGroupId;
  meta["creative_id"] = creativeId;
  meta["network_name"] = networkName;
  
  meta["load_timeout"] = loadTimeout;
  
  meta["orientation"] = orientation;
  meta["width"] = width;
  meta["height"] = height;
  
  let impressionData = {};
  
  impressionData["id"] = requestId;
  impressionData["ad_unit_id"] = adUnitId;
  impressionData["ad_group_id"] = adGroupId;
  
  impressionData["network_name"] = networkName;
  impressionData["network_placement_id"] = networkPlacementId;
  
  impressionData["user_segment"] = userSegment;
  
  impressionData["country"] = country;
  impressionData["currency"] = currency;
  
  impressionData["precision_type"] = precisionType;
  
  impressionData["revenue"] = revenue;
  
  impressionData["demand_partner_data"] = demandPartnerData;
  
  meta["impression_data"] = impressionData;
  
  let numClickUrls = clickUrls.length;
  if (numClickUrls > 0)
  {
    if (numClickUrls == 1)
    {
      meta["click_url"] = clickUrls[0];
    }
    else
    {
      meta["click_urls"] = clickUrls;
    }
  }
  
  let numImpressionUrls = impressionUrls.length;
  if (numImpressionUrls > 0)
  {
    if (numImpressionUrls == 1)
    {
      meta["impression_url"] = impressionUrls[0];
    }
    else
    {
      meta["impression_urls"] = impressionUrls;
    }
  }
  
  let numBeforeLoadUrls = beforeLoadUrls.length;
  if (numBeforeLoadUrls > 0)
  {
    if (numBeforeLoadUrls == 1)
    {
      meta["before_load_url"] = beforeLoadUrls[0];
    }
    else
    {
      meta["before_load_urls"] = beforeLoadUrls;
    }
  }
  
  let numAfterLoadUrls = afterLoadUrls.length;
  if (numAfterLoadUrls > 0)
  {
    if (numAfterLoadUrls == 1)
    {
      meta["after_load_url"] = afterLoadUrls[0];
    }
    else
    {
      meta["after_load_urls"] = afterLoadUrls;
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
    
    let adFormat = body["ad_format"];
    let adUnitId = body["ad_unit_id"];
    
    let baseUrl = req.protocol + '://' + req.get('host');
    
    let ret = {}
    
    let requestId = getUniqueId();
    
    ret["request_id"] = requestId;
    
    let adResponses = [];
    adResponses.push(await createAdData(body, adFormat, adUnitId, baseUrl, requestId));
    
    ret["ads"] = adResponses;
    
    if (adFormat == "interstitial")
    {
      let settings = {};
      settings['max_exp_time']=0;
      settings['min_time']=0;
      settings['countdown_timer_delay']=0;
      settings['show_countdown_timer']=true;
      
      let endCard = {}
      endCard['static_min_time']=0;
      endCard['interactive_min_time']=0;
      endCard['static_duration']=0;
      endCard['interactive_duration']=0;
      endCard['countdown_timer_delay']=0;
      endCard['show_countdown_timer']=true;
      
      settings['end_card']=endCard;
      
      ret['ad_settings'] = settings;
    }
    else if (adFormat == "rewarded_ad")
    {
      let settings = {};
      settings['max_exp_time']=0;
      settings['min_time']=10000;
      settings['countdown_timer_delay']=0;
      settings['show_countdown_timer']=true;
      
      let endCard = {}
      endCard['static_min_time']=0;
      endCard['interactive_min_time']=0;
      endCard['static_duration']=5000;
      endCard['interactive_duration']=10000;
      endCard['countdown_timer_delay']=0;
      endCard['show_countdown_timer']=true;
      
      settings['end_card']=endCard;
      
      ret['ad_settings'] = settings;
    }
    
    res.json(ret);
  } catch (err) {
    console.error(`Error while processing ad request `, err.message);
    next(err);
  }
});

module.exports = router;