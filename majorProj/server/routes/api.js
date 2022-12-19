const express = require('express');
const router = express.Router();

//declare jwt for json web token integration
const jwt = require('jsonwebtoken');

// declare axios for making http requests
const axios = require('axios');
const API = 'https://jsonplaceholder.typicode.com';

//declare json secret here
var secret = 'randomstring';


//get API listing
router.get('/', (req, res) => {
    res.send('api works');
});

//To bcrypt password
const bcrypt = require("bcryptjs");
const e = require('express');
const BCRYPT_SALT_ROUNDS = 12;

//MongoDB
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
var db;


MongoClient.connect('yourstring', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, database) => {
    if (err) return console.log(err);
    db = database.db('Major-proj');
});

//setup a end point to get all issues 
//add jwt token where only logined users can access this user (any role is possible)
router.route('/getAllIssues').get(verifyToken,function (req, res) {

    //check if there is jwt token provided
    jwt.verify(req.token,secret,(err,authData) => {
        if(err) {
            res.sendStatus(403);
            console.log('hi')
            
        }
        
        else{
            console.log(authData)
            db.collection('issues').find({}).toArray((err, results) => {
                if (err) return console.log(err);
                console.log('retrieve issues from database');
                res.send(results);
            });
        }
    });

   
});

//Create issue
//only operations team can create issue
router.route('/createIssue').post(verifyToken,function (req, res) {
    jwt.verify(req.token,secret,(err,authData)=>{
        if(err){
            res.sendStatus(403)
        }
        if( authData.role != 'Ops Team'){
            res.sendStatus(403)
            console.log('you dont have the access rights to create issues')
        }
        else{

            db.collection('issues').insertOne(req.body, (err, results) => {
                if (err) return console.log(err);
                console.log('saved issue to database');
                res.send(results);
                console.log(results.insertedId);
            });
        }
    })
    
});

// update issue based on id
// only ops can update the issue
router.route('/getIssue/:_id').put(verifyToken, function (req, res) {
    jwt.verify(req.token,secret,(err,authData)=>{
        if(err){
            res.sendStatus(403);
            console.log(authData)
        }
        if(authData.role != 'Ops Team'){
            res.sendStatus(403);
            console.log(authData.role)
        }
        else{

            db.collection('issues').updateOne({ "_id": ObjectId(req.params._id) }, {
                $set: req.body
            }, (err, results) => {
                res.send(results);
            });
        }
    })
    
});

// delete issue based on id
// only ops team have the permission to do 
router.route('/getIssue/:_id').delete(verifyToken,function (req, res) {
    jwt.verify(req.token,secret,(err,authData)=>{
        if(err){
            res.sendStatus(403);
            console.log('no token')
        }
        if(authData.role != 'Ops Team'){
            res.sendStatus(403);
            console.log(authData.role)
        }
        else{

            db.collection('issues').deleteOne({ "_id": ObjectId(req.params._id) }, (err,
                results) => {
                res.send(results);
            });
        }
    })
    
});

//Retrieve single issue
//All users can retrieve as long as they are logged in.
router.route('/getIssue/:_id').get(verifyToken,function (req, res){
    jwt.verify(req.token,secret,(err,authData)=>{
        if(err){
            res.sendStatus(403);
            
        }
        else{
            console.log(authData)
            console.log(req.params._id, "id");
            return db.collection('issues').findOne({ "_id": ObjectId(req.params._id) }, function (err, results) {
                if (err) return console.log(err);
                console.log('retrieve issue details');
                res.send(results);
            });
        }
    })
 

});

//Regiseter user into mongodb
router.route('/reguser').post(function (req, res) {
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
            if (err) res.send([{ "auth": false }])
            else {
                console.log('user registered')
                
                res.send([{ "auth": true, "role": user.team, "username": user.username }]);
            }
        });
    });
});

//Authenticate login & generate JWT
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
                    //bind username and team into this token generated!
                    var token = jwt.sign({ "username": result.username ,"role":result.team},secret,{expiresIn:'24h'});
                    res2.send([{ "auth": true, "role": result.team, "email": user.email, "token":token, "username": user.username, "firstName": result.firstName }]);
                }
            })
        }
    });
});



//Get all users registered in the mongoDB
//Only Portal Admin can access this url
router.route("/users").get(verifyToken,function (req, res) {
    jwt.verify(req.token,secret,(err,authData)=>{
        if(err){
            res.sendStatus(403);
            console.log(authData)
        }
        if(authData.role != 'Ops Team'){
            res.sendStatus(403);
            console.log(authData.role);
        }
        else{
            db.collection("users")
            .find()
            .toArray((err, results) => {
                res.send(results);
            });
        }
    })
    
});


//Delete user by id
//Only Ops Team can delete user - user needs to be logged in and has a token role of "Ops Team"
router.route('/users/:_id').delete(verifyToken,function (req, res) {
    jwt.verify(req.token,secret,(err,authData)=>{
        if(err){
            res.sendStatus(403);
            console.log(authData)
        }
        if(authData.role != 'Ops Team'){
            res.sendStatus(403);
            console.log(authData.role)

        }
        else{

            db.collection('users').deleteOne({ "_id": ObjectId(req.params._id) }, (err, results) => {
                res.send(results);
            });
        }
    })
   
});


//Get profile data based on user  baased on user's username
//token is required to access the url of the page
router.route('/profile').get(verifyToken,function(req,res){
    jwt.verify(req.token,secret,(err,authData)=>{
        if(err){
            res.sendStatus(403);
        }
        else{

            db.collection('users').find({ "username": authData.username }).toArray((err,results)=> {
                if (err) return console.log(err);
                console.log('retrieve user details');
                res.send(results);
            });
        }
    })
    
});



//Edit profile data based on id
//token is required to access the url of the page
router.route('/profile/:_id').put(verifyToken,function (req, res) {
    jwt.verify(req.token,secret,(err,authData)=>{
        if(err){
            res.sendStatus(403);
            console.log(authData)
        }
        else{
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
                console.log(password)
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
        }
    })
    
});

//Create new user 
//onnly if user is logged in with a token role of "Ops Team" 
router.route("/users").post(verifyToken,function (req, res) {
    jwt.verify(req.token,secret,(err,authData)=>{
        if(err){
            res.sendStatus(403);

        }
        if(authData.role != 'Ops Team'){
            res.sendStatus(403);
            console.log(authData.role)
        }
        else{
            
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
        }
    })
    
    
});


// Authorization: Bearer <access_token> --> formation of the token
//function verify token -> where header is authorization, split the token from the bearer via space , and get the token.
function verifyToken(req,res,next){
    // get the auth header value 
    const bearerHeader = req.headers['authorization'];
    //Check if bearer is undefined 
    if(typeof bearerHeader !== 'undefined'){
      // take token out of the bearer --> split by space -> becomes an array
      const bearer = bearerHeader.split(' ');
      //get token from array 
      const bearerToken = bearer[1];
      //set the token 
      req.token = bearerToken;
      //next middleware
      next();

    }
    else{
      //Forbidden
      res.sendStatus(403);

    }

  }


module.exports = router;