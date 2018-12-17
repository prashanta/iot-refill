var express = require('express');
var router = express.Router();
var db = require('./core/mongoutil.js');

module.exports = function (app) {
    app.use('/', router);
};

// Root
router.get('/', function(req, res) {
    var dbo = new db();
    dbo.connect()
    .then(function(){ return dbo.getDevices(); })
    .then(
        function(result){
            console.log(result);
            dbo.close();
            var data = {devices: null};
            if(result.length>0)
                data = {devices : result};
            res.render('index', data);
        }
    )
    .catch(function(err){
        console.log(err);
        dbo.close();
        res.render('index');
    });
});

// Add New Device Page
router.get('/add', function(req, res) {
    res.render('add');
});

// New Device Added Page
router.get('/newdevice', function(req, res) {
    var dbo = new db();
    var device = req.query;
    dbo.connect()
    .then(function(){ return dbo.addDevice(device); })
    .then(
        function(result){
            console.log(result);
            device.result = 1;
            res.render('newdevice', device);
            dbo.close();
        }
    )
    .catch(function(err){
        dbo.close();
        console.log(err);
        device.result = 0;
        device.error = err;
        res.render('newdevice', device);
    });
});
