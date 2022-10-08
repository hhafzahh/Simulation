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

//setup a end point to get all room
router.get('/issues', (req, res) => {

    //return the list of room
    return db.collection('issues').find({})
        .toArray((err, results) => {
            if (err) return console.log(err);
            console.log('retrieve issues from database');
            res.send(results);
        });
});

module.exports = router;