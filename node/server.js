var express = require('express');
var app = express();
var config = require('./app/config');

require('./app/main')(app, config);

app.listen(config.port, function () {
   console.log('Starting  ... ');
   console.log('Server listening on port ' + config.port);
});
