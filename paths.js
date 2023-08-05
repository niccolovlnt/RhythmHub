const mongoClient=require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId;
//const auth=require('./auth').auth
const crypto=require('crypto')
var cors=require('cors')
const express=require('express');
const path=require('path');
const mongo="mongodb+srv://volonteniccolo:olCHDtzs1wtnYLEl@pwm.yfvispg.mongodb.net/?retryWrites=true&w=majority"

const app=express();
app.use(cors())
app.use(express.json())
app.use(express.static("public"));

function hash(input) {
    return crypto.createHash('md5')
        .update(input)
        .digest('hex')
}

app.get('/users', async function(req, res){
    var client=await new mongoClient(mongo).connect()
    var users=await client.db("RhythmHub").collection("Users").find().project({"pass":0}).toArray()
    res.json(users)
})

async function addUser(res, user) {
    if(user.name==undefined){
        res.status(400).send("Missing name")
        return
    }
    if(user.surname==undefined){
        res.status(400).send("Missing surname")
        return
    }
    if (user.username == undefined) {
        res.status(400).send("Missing username")
        return
    }
    if (user.mail == undefined) {
        res.status(400).send("Missing Email")
        return
    }
    if (user.pass == undefined || user.pass.length < 3) {
        res.status(400).send("Password is missing or too short")
        return
    }
    if(user.genres == undefined){
        res.status(400).send("Genres not chosen")
        return
    }
    user.pass = hash(user.pass)
    var pwmClient = await new mongoClient(mongo).connect()
    try {
        var items = await pwmClient.db("RhythmHub").collection('Users').insertOne(user)
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

app.post("/login", async (req,res)=>{
    login=req.body
    if (login.mail == undefined) {
        res.status(400).send("Missing Email")
        return
    }
    if (login.pass == undefined) {
        res.status(400).send("Missing Password")
        return
    }
    login.pass=hash(login.pass)
    var pwmClient = await new mongoClient(mongo).connect()
    var filter = {
        $and: [
            { "mail": login.mail },
            { "pass": login.pass }
        ]
    }
    var loggedUser = await pwmClient.db("RhythmHub")
        .collection('Users')
        .findOne(filter);
    //console.log(loggedUser)
    if (loggedUser == null) {
        res.status(401).send("Unauthorized")
    } else {
        res.json(loggedUser)
    }
})

app.post("/users", function (req, res) {
    /*	#swagger.parameters['obj'] = {
    in: 'body',
    description: 'User information.',          
    } */
    addUser(res, req.body)
})

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.listen(3000, "0.0.0.0", ()=>{
    console.log("Server Initialized")
})

app.delete("/users/:id", function(req, res){
    deleteUser(res, req.params.id)
})

async function deleteUser(res, id){
  try {
    var client = await new mongoClient(mongo).connect()
    var collection = client.db('RhythmHub').collection('Users');
    var objectId = new ObjectId(id);
    var result = await collection.deleteOne({ _id: objectId });
    if (result.deletedCount === 1) {
      res.status(200).json({ message: 'User deleted successfully.' });
    } else {
      res.status(404).json({ error: 'User not found.' });
    }
  } catch (error) {
    console.error('Error occurred while deleting user:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
}










//await client.db("RhythmHub").collection("Users").deleteOne({ _id: id });
    // users=users.filter(user => user._id != id)
    // res.json(users)