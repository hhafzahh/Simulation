const express = require('express');
const router = express.Router();

// declare axios for making http requests
const axios = require('axios');
const API = 'https://jsonplaceholder.typicode.com';

//get API listing
router.get('/', (req, res) => {
    res.send('api works');
});

//To bcrypt password
const bcrypt = require("bcryptjs");
const BCRYPT_SALT_ROUNDS = 12;

//MongoDB
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
var db;


MongoClient.connect('yourString', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, database) => {
    if (err) return console.log(err);
    db = database.db('Major-proj');
});

//setup a end point to get all issues
router.get('/getAllIssues', (req, res) => {

    //return the list of room
    return db.collection('issues').find({})
        .toArray((err, results) => {
            if (err) return console.log(err);
            console.log('retrieve issues from database');
            res.send(results);
        });
});

//Create issue
router.route('/createIssue').post(function (req, res) {
    db.collection('issues').insertOne(req.body, (err, results) => {
        if (err) return console.log(err);
        console.log('saved issue to database');
        res.send(results);
        console.log(results.insertedId);
    });
});

// update issue based on id
router.route('/getIssue/:_id').put(function (req, res) {
    db.collection('issues').updateOne({ "_id": ObjectId(req.params._id) }, {
        $set: req.body
    }, (err, results) => {
        res.send(results);
    });
});

// delete booking based on id
router.route('/getIssue/:_id').delete(function (req, res) {
    db.collection('issues').deleteOne({ "_id": ObjectId(req.params._id) }, (err,
        results) => {
        res.send(results);
    });
});

//Retrieve single issue
router.get('/getIssue/:_id', (req, res) => {
    console.log(req.params._id, "id");
    return db.collection('issues').findOne({ "_id": ObjectId(req.params._id) }, function (err, results) {
        if (err) return console.log(err);
        console.log('retrieve issue details');
        res.send(results);
    });

});

//Regiseter user into mongodb
router.route('/reguser').post(function (req, res) {
    var username = req.body.username;
    var password = req.body.pwSet.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var mobileNum = req.body.mobileNum;
    var email = req.body.email;
    var user = req.body;
    var team = req.body.team;
    bcrypt.hash(password, BCRYPT_SALT_ROUNDS, function (err, hash) {
        db.collection('users').insertOne({
            "firstName": firstName, "lastName": lastName, "mobileNum": mobileNum, "email": email, "username": username, "password": hash,
            "team": team
        }, (err, result) => {
            console.log(user);
            if (err) res.send([{ "auth": false }])
            else {
                console.log('user registered')
                //var token = jwt.sign({ "username":result.username },'123',{expiresIn:'24h'});
                res.send([{ "auth": true, "role": user.team, "username": user.username }]);
            }
        });
    });
});

//Authenticate login
router.route('/authuser').post(function (req, res2) {
    var username = req.body.username;
    var password = req.body.password;
    var user = req.body;
    db.collection('users').findOne({ "username": username }, { password: 1, role: 1, _id: 0 }, function (err, result) {
        console.log(result)
        if (result == null) res2.send([{ "auth": false }]);
        else {
            bcrypt.compare(password, result.password, function (err, res) {
                if (err || res == false) {
                    res2.send([{ "auth": false }]);
                }

                else {
                    res2.send([{ "auth": true, "team": result.team, "email": user.email, "username": user.username, "firstName": result.firstName }]);
                }
            })
        }
    });
});



//Get all users registered in the mongoDB
router.route("/users").get(function (req, res) {
    db.collection("users")
        .find()
        .toArray((err, results) => {
            res.send(results);
        });
});


//Delete user by id
router.route('/users/:_id').delete(function (req, res) {
    db.collection('users').deleteOne({ "_id": ObjectId(req.params._id) }, (err, results) => {
        res.send(results);
    });
});


//Get profile data based on user  baased on user's username
router.get('/profile/:username', (req, res) => {
    console.log(req.params.username, "id");
    return db.collection('users').findOne({ "username": req.params.username }, function (err, results) {
        if (err) return console.log(err);
        console.log('retrieve yser details');
        res.send(results);
    });
});



//Edit profile data based on id
router.route('/profile/:_id').put(function (req, res) {
    var username = req.body.username;
    var password = req.body.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var mobileNum = req.body.mobileNum;
    var email = req.body.email;
    var user = req.body;
    var team = req.body.team;

    //hash password
    bcrypt.hash(password, BCRYPT_SALT_ROUNDS, function (err, hash) {

        db.collection('users').updateOne({ "_id": ObjectId(req.params._id) }, {
            $set: {
                "firstName": firstName, "lastName": lastName, "mobileNum": mobileNum, "email": email, "username": username, "password": hash,
                "team": team
            }
        }, (err, results) => {
            console.log(results);
            res.send(results)
            if (err) return console.log(err)
        });
    });
});

//Create new user 
//onnly if user is logged in with a token role of "admin" //implement later
router.route("/users").post(function (req, res) {

    var username = req.body.username;
    var password = req.body.password;
    var firstName = req.body.firstName;
    var lastName = req.body.lastName;
    var mobileNum = req.body.mobileNum;
    var email = req.body.email;
    var user = req.body;
    var team = req.body.team;
    bcrypt.hash(password, BCRYPT_SALT_ROUNDS, function (err, hash) {
        db.collection('users').insertOne({
            "firstName": firstName, "lastName": lastName, "mobileNum": mobileNum, "email": email, "username": username, "password": hash,
            "team": team
        }, (err, result) => {
            console.log(user);
            if (err) return console.log(err)
        });
    });
});


module.exports = router;