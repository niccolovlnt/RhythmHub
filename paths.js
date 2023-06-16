const mongoClient=require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId;
//const auth=require('./auth').auth
const crypto=require('crypto')
var cors=require('cors')
const express=require('express')
const path=require('path');
const { MongoClient } = require('mongodb');
const mongo="mongodb+srv://volonteniccolo:olCHDtzs1wtnYLEl@pwm.yfvispg.mongodb.net/?retryWrites=true&w=majority"
const app=express()
app.use(cors())
app.use(express.json())
function hash(input) {
    return crypto.createHash('md5')
        .update(input)
        .digest('hex')
}

app.get('/users', async function(req, res){
    var client=await new MongoClient(mongo).connect()
    var users=client.db("RhythmHub").collection("Users").find().project({"password":0}).toArray()
    res.json(users)
})

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/index.html'));
});

async function addUser(res, user) {
    if (user.name == undefined) {
        res.status(400).send("Missing Name")
        return
    }
    if (user.surname == undefined) {
        res.status(400).send("Missing Surname")
        return
    }
    if (user.email == undefined) {
        res.status(400).send("Missing Email")
        return
    }
    if (user.password == undefined || user.password.length < 3) {
        res.status(400).send("Password is missing or too short")
        return
    }
    if (user.date == undefined) {
        res.status(400).send("Date is missing or too short")
        return
    }

    user.password = hash(user.password)

    var pwmClient = await new mongoClient(uri).connect()
    try {
        var items = await pwmClient.db("pwm").collection('users').insertOne(user)
        res.json(items)

    }
    catch (e) {
        console.log('catch in test');
        if (e.code == 11000) {
            res.status(400).send("Utente già presente")
            return
        }
        res.status(500).send(`Errore generico: ${e}`)
    };
}
app.post("/users", function (req, res) {
    addUser(res, req.body)
})
app.listen(3000, "0.0.0.0", ()=>{
    console.log("Server Initialized")
})