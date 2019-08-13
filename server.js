const express = require('express');
const app = express();
const path = require('path');
const frameguard = require('frameguard');
var helmet = require('helmet');
app.disable('x-powered-by');
app.use(helmet());
app.use(helmet.featurePolicy({
  features: {
    fullscreen: ["'self'"],
    vibrate: ["'none'"],
    payment: ["'none'"],
    syncXhr: ["'none'"],
    push: ["'none'"]
  }
}));
// Sets "Strict-Transport-Security: max-age=5184000; includeSubDomains".
const sixtyDaysInSeconds = 5184000;
app.use(helmet.hsts({
  maxAge: sixtyDaysInSeconds
}));

app.use('/smartapps/smartmonitoring/', express.static(`${__dirname}/dist/vertical-foundations`));

app.get('/*', function (req, res) {
  res.sendFile(path.join(`${__dirname}/dist/vertical-foundations/index.html`));
});
app.use(frameguard({action: 'sameorigin'}));
app.listen(process.env.PORT || 8080, function () {
  console.log(`Listening at http://localhost:${process.env.PORT || 8080}`);
});
