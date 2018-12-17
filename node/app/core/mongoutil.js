var MongoClient = require('mongodb').MongoClient;

module.exports = function(){
    this.db = null;

    this.url = "mongodb://mongo";

    this.connect =  function(){
        var _this = this;
        return new Promise(function(resolve, reject) {
            if (this.db) {
                resolve();
            } else {
                MongoClient.connect(_this.url, { useNewUrlParser: true } )
                .then(
                    function(database) {
                        _this.db = database;
                        resolve();
                    },
                    function(err) {
                        console.log("Error connecting: " + err.message);
                        reject(err.message);
                    }
                );
            }
        });
    };

    this.close = function() {
        if (this.db) {
            this.db.close()
            .then(
                function() {},
                function(error) {
                    console.log("Failed to close the database: " + error.message);
                }
            );
        }
    };

    this.addDevice = function(device){
        var dbo = this.db.db("mydb");
        return new Promise(function(resolve, reject) {
            dbo.collection("devices").insertOne(device)
            .then(
                function(results) {
                    resolve(results.insertedCount);
                },
                function(err) {
                    console.log("Failed to insert Docs: " + err.message);
                    reject(err.message);
                }
            );
        });
    };

    this.getDevices = function(){
        var dbo = this.db.db("mydb");
        return new Promise(function(resolve, reject) {
            dbo.collection("devices").find({}).toArray(function(error, result){
                if (error) {
                    reject(error.message);
                } else {
                    resolve(result);
                }
            });
        });
    };

    this.getDevice = function(id){
        var dbo = this.db.db("mydb");
        return new Promise(function(resolve, reject) {
            dbo.collection("devices").find({'deviceId':id}).toArray(function(err, result){
                if (err)
                    reject(err.message);
                else{
                    console.log(result);
                    resolve(result);
                }
            });
        });
    };
};
