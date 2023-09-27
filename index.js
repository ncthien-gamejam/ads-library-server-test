import express from 'express';
const app = express();

import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3001;

import { router as adRouter } from './routes/ad.js';

import { router as clickRouter } from './routes/click.js';
import { router as impressionRouter } from './routes/impression.js';
import { router as rewardedCompleteRouter } from './routes/rewardedComplete.js';

import { router as errorRouter } from './routes/error.js';

import { router as trackingRouter } from './routes/tracking.js';

import { router as beforeLoadRouter } from './routes/beforeLoad.js';
import { router as afterLoadRouter } from './routes/afterLoad.js';

import { router as omidVerifyRouter } from './routes/omidVerify.js';
import { router as omidVerifyFailedRouter } from './routes/omidVerifyFailed.js';

app.enable('trust proxy');

app.use(express.static(__dirname + '/public'));

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get("/", (req, res) => res.type('html').send(html));

app.use("/ad", adRouter);

app.use("/click", clickRouter);
app.use("/impression", impressionRouter);
app.use("/rewarded_complete", rewardedCompleteRouter);

app.use("/error", errorRouter);

app.use("/tracking", trackingRouter);

app.use("/before_load", beforeLoadRouter);
app.use("/after_load", afterLoadRouter);

app.use("/omid_verify", omidVerifyRouter);
app.use("/omid_verify_failed", omidVerifyFailedRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Superfine!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Superfine!
    </section>
  </body>
</html>
`