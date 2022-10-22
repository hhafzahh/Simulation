const express = require('express');
const router = express.Router();

// declare axios for making http requests
const axios = require('axios');
const API = 'https://jsonplaceholder.typicode.com';

// get API listing
router.get('/', (req, res) => {
    res.send('api works');
});

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
module.exports = router;