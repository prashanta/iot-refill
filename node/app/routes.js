var express = require('express');
var router = express.Router();
var low = require('lowdb');
var FileSync = require('lowdb/adapters/FileSync');
var adapter = new FileSync('db.json');
var db = low(adapter);

module.exports = function (app) {
    app.use('/', router);
};

// Root
router.get('/', function(req, res) {

    var data = {devices: null};
    var result = db.get('devices').value();
    console.log(result);
    if(result == null){
        db.defaults({ devices: []}).write();
    }
    else if(result.length>0){
        data = {devices : result};
    }
    res.render('index', data);
});

// Add New Device Page
router.get('/add', function(req, res) {
    res.render('add');
});

// New Device Added Page
router.get('/newdevice', function(req, res) {
    var device = req.query;
    try{
        db.get('devices').push(device).write();
        res.render('newdevice', {result:1});
    }
    catch(err) {
        res.render('newdevice', {result:0});
    }
});

// Remove Device
router.get('/remove', function(req, res) {
    try{
        db.get('devices').remove({deviceId: req.query.deviceId }).write();
        res.redirect("/");
    }
    catch(err) {
        res.redirect("/");
    }
});
