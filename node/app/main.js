var path = require('path');
var express = require('express');
var exphbs  = require('express-handlebars');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var glob = require('glob');
var mqttClient  = require('./core/mqttutil');

module.exports = function(app, config) {
    // Setup views
    app.set('views', path.join(config.root, 'app', 'views'));
    app.engine('handlebars', exphbs({
        defaultLayout: 'main',
        layoutsDir: path.join('app', 'views', 'layouts'),
        partialsDir: path.join('app', 'views', 'partials')
    }));
    app.set('view engine', 'handlebars');

    mqttClient.setup();

    app.use(morgan('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(express.static(config.root + '/public'));

    // Register routes
    require('./routes')(app);

    app.use(function (req, res, next) {
        var err = new Error('Not found : ' + req.path);
        err.status = 404;
        next(err);
    });

    app.use(function (err, req, res, next) {
        console.log(err);
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {},
            title: 'error'
        });
    });
};
