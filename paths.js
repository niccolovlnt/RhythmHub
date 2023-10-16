const mongoClient=require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId;
const crypto=require('crypto')
const cors=require('cors')
const express=require('express')
const path=require('path')
const mongo="mongodb+srv://volonteniccolo:olCHDtzs1wtnYLEl@pwm.yfvispg.mongodb.net/?retryWrites=true&w=majority"
const jwt=require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const auth=require('./public/auth.js').auth
const bodyParser=require('body-parser')
const app=express()

app.use(express.json())
app.use(express.static("public"))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(cors())
// app.use(auth)



const jwtsecret="0612ad6d7052a272cebce186435b76ab903a36a70b649b9f53988afb7efbf77e0c14ecf294cf16ce35f3bd96cf9ba79decbf008a5054f5438c06c85dda036e04"
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
        var token=jwt.sign({user}, jwtsecret, {expiresIn: '3600s'});
        res.cookie('jwttoken',token, {httpOnly: true});
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

app.post("/login", auth, async (req,res)=>{
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
    console.log(loggedUser)
    if (loggedUser==null) {
    res.status(401).send("Unauthorized")
    //gestire utente insesistenti o psw sbagliata
    } else {
        const token=jwt.sign({loggedUser}, jwtsecret, {expiresIn: '3600s'});
        res.cookie("jwttoken", token, {httpOnly: true});
        res.json(loggedUser)
    }
})

app.post("/users", function (req, res) {
    addUser(res, req.body)
})

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/index.html'));
})

app.get('/login', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/login.html'));
})

app.get('/search', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/search.html'));
})

app.get('/signup', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/signup.html'));
})

app.listen(3000, "0.0.0.0", ()=>{
    console.log("Server Initialized")
})

app.delete("/users/:id", auth, function(req, res){
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

app.put("/update/:id", auth, function(req, res){
    updateUser(res, req.params.id, req.body)
})

async function updateUser(res, id, updatedUser){
    if (updatedUser.name == undefined) {
        res.status(400).send("Missing Name")
        return
    }
    if (updatedUser.surname == undefined) {
        res.status(400).send("Missing Surname")
        return
    }
    if (updatedUser.mail == undefined) {
        res.status(400).send("Missing Email")
        return
    }
    if(updatedUser.username == undefined){
        res.status(400).send("Missing Username")
        return
    }
    if (updatedUser.pass !== undefined) {
        updatedUser.pass = hash(updatedUser.pass)
    }
    
    try{
        var client = await new mongoClient(mongo).connect()
        var filter={"_id": new ObjectId(id)}
        var upUserToInsert={
            $set: updatedUser
        }
        await client.db("RhythmHub").collection("Users").updateOne(filter, upUserToInsert)
        var item=await client.db("RhythmHub").collection("Users").findOne(filter);
        res.send(item)
    }catch(e){
        console.log('catch in test');
        if (e.code == 11000) {
            res.status(400).send("Utente già presente")
            return
        }
        res.status(500).send(`Errore: ${e}`)
    }
}