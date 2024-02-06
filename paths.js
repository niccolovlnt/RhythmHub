const mongoClient=require('mongodb').MongoClient;
const ObjectId=require('mongodb').ObjectId;
const crypto=require('crypto')
const cors=require('cors')
const express=require('express')
const path=require('path')
const cookie=require('cookie')
const mongo="mongodb+srv://volonteniccolo:olCHDtzs1wtnYLEl@pwm.yfvispg.mongodb.net/?retryWrites=true&w=majority"
const jwt=require('jsonwebtoken');
const cookieParser = require('cookie-parser')
const auth=require('./public/auth.js').auth
const bodyParser=require('body-parser');
const { log } = require('console');
const app=express()

//captcha
// const Recaptcha = require('express-recaptcha').RecaptchaV3
// var recaptcha=new Recaptcha('6LcO48YoAAAAANyTfxqXOFDJs51Uhzq9JoWFu21h','6LcO48YoAAAAAF8czKhMJTi6pYzSWnY3RaPEEA03')

app.use(express.json())
app.use(express.static("public"))
app.use(bodyParser.json())
// app.use(bodyParser.urlencoded())
app.use(cookieParser())
app.use(cors())

//frontend variables
const url ="https://accounts.spotify.com/api/token"
const client_ID = "ecd0dfc2d7f14d23a0ed755829e2ce3d"
const client_Secret = "561839255308440f9c7e5df1f04f2cb1"
var spotytoken=""

//cors variables
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

// spotify token refresh
  fetch((url), {
    method: "POST",
    headers: {
        Authorization: "Basic " + btoa(`${client_ID}:${client_Secret}`),
        "Content-Type": "application/x-www-form-urlencoded",
      },
    body: new URLSearchParams({ grant_type: "client_credentials" }), })
    .then((response) => response.json()) .then((tokenResponse) =>
    spotytoken=tokenResponse.access_token       
  ) 
  setInterval(() => {
    fetch((url), {
      method: "POST",
      headers: {
          Authorization: "Basic " + btoa(`${client_ID}:${client_SECRET}`),
          "Content-Type": "application/x-www-form-urlencoded",
        },
  body: new URLSearchParams({ grant_type: "client_credentials" }), })
  .then((response) => response.json()) .then((tokenResponse) =>
            spotytoken=tokenResponse.access_token       
  )
  }, (1000*60)*59);


const jwtsecret="0612ad6d7052a272cebce186435b76ab903a36a70b649b9f53988afb7efbf77e0c14ecf294cf16ce35f3bd96cf9ba79decbf008a5054f5438c06c85dda036e04"

//hashing psw function
function hash(input) {
    return crypto.createHash('md5')
        .update(input)
        .digest('hex')
}

app.get('/users', auth, async function(req, res){
    var client=await new mongoClient(mongo).connect()
    var users=await client.db("RhythmHub").collection("Users").find().project({"pass":0}).toArray()
    res.json(users)
})

async function addUser(res, user) {
    if(user.name==undefined){
        res.status(401).send("Missing name")
        return
    }
    if(user.surname==undefined){
        res.status(401).send("Missing surname")
        return
    }
    if (user.username == undefined) {
        res.status(401).send("Missing username")
        return
    }
    if (user.mail == undefined) {
        res.status(401).send("Missing Email")
        return
    }
    if (user.pass == undefined || user.pass.length < 8) {
        res.status(401).send("Password is missing or too short")
        return
    }
    if(user.genres == undefined){
        res.status(401).send("Genres not chosen")
        return
    }
    user.pass = hash(user.pass)
    var pwmClient = await new mongoClient(mongo).connect()
    try {
        var items = await pwmClient.db("RhythmHub").collection('Users').insertOne(user)
        var token=jwt.sign({user}, jwtsecret, {expiresIn: '3600s'});
        res.cookie('token',token, {httpOnly: true});
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
    var login=req.body
    if(login.pass === undefined || login.mail === undefined){
        res.status(401).send("Wrong e-mail or password.")
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
    if (loggedUser==null) {
        res.status(401).send("Wrong e-mail or password.")
    } else {
        var token=jwt.sign({loggedUser}, jwtsecret, {expiresIn: '3600s'});
        res.cookie('token',token, {httpOnly: true});
        res.json(loggedUser).send()
    }
})

app.post("/users", function (req, res) {
    addUser(res, req.body)
})

app.get('/', auth, function (req, res) {
    res.sendFile(path.join(__dirname, 'public/home.html'));
})


app.get('/login', function (req, res) {   
    res.sendFile(path.join(__dirname, 'public/login.html'));
})

app.get('/search',auth, function (req, res) {
    res.sendFile(path.join(__dirname, 'public/search.html'));
})

app.get('/signup', function (req, res) {
    res.sendFile(path.join(__dirname, 'public/signup.html'));
})

app.get('/playlist', auth, function (req, res) {
    res.sendFile(path.join(__dirname, 'public/playlist.html'));
})

// app.listen(3001, "192.168.1.133", ()=>{
//     console.log("Server Initialized")
// })

app.listen(3000, "127.0.0.1", ()=>{
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

//implementation of frontend requests

app.get('spoty/artists', auth, function(req, res){
    fetch
})

app.get("/spoty/tops", auth,function(req, res){
    fetch(`https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF?market=IT&limit=50`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + spotytoken,
        },
    })
    .then(response => {
        return response.json()
    })
    .then(data =>{
        res.json(data)
    })
    .catch(e =>{
        console.error("Error: ",e)
    })
})

app.get("/spoty/song/:id", function(req, res){
    var id=req.params.id
    fetch(`https://api.spotify.com/v1/tracks/${id}`,{
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + spotytoken,
        },
    })
    .then(response => {
        return response.json()
    })
    .then(data =>{
        res.json(data)
    })
    .catch(e =>{
        console.error("Error: ", e)
    })
})

app.get("/spoty/search", function(req, res){
    var query=req.query.query
    fetch(`https://api.spotify.com/v1/search?q=${query}&type=track%2Cartist&market=IT&limit=50`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + spotytoken,
        },
    })
    .then(response =>{
        return response.json()
    })
    .then(data =>{
        res.json(data)
    })
    .catch(e =>{
        console.error("Error: ", e)
    })
})



app.get("/spoty/song", auth, function(req, res){
    var ident=req.query.id
    fetch(`https://api.spotify.com/v1/tracks/${ident}`,{
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + spotytoken,
        },
    })
    .then(response => {
        return response.json()
    })
    .then(data =>{
        res.json(data)
    })
    .catch(e =>{
        console.error("Error: ", e)
    })
})

app.get('/api/genres', function(req, res){
    fetch(`https://api.spotify.com/v1/recommendations/available-genre-seeds`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + spotytoken,
        },
    })
    .then(response => {
        return response.json()
    })
    .then(data => {
        res.json(data)
    })
    .catch(e =>{
        console.error("Error: ", e)
    })
})

app.get("/logout", auth, function(req, res){
    res.clearCookie("token");
    return res.redirect('/login')
})

// Favorites

// add song to playlist
async function addFavorites(res, id, song_id) {
    try {
        var pwmClient = await new mongoClient(mongo).connect()
        var filter = { "_id": new ObjectId(id) }
        var favorite = {
            $push: {song_ids: song_id}
        }
        // console.log(filter)
        // console.log(favorite)
        var item = await pwmClient.db("RhythmHub")
            .collection('Favourites')
            .updateOne(filter, favorite)
        res.send(item)
    } catch (e) {
        res.status(500).send(`Errore generico: ${e}`)
    };
}

async function deletePlaylist(res, id){
    try{
        var pwmClient = await new mongoClient(mongo).connect()
        var filter = { "_id": new ObjectId(id) } // Changed from "user_id" to "_id"
        var item = await pwmClient.db("RhythmHub")
            .collection('Favourites')
            .deleteOne(filter)
        res.send(item)
    } catch (e) {
        res.status(500).send(`Errore generico: ${e}`)
    };
}

async function createPlaylist(res, play){
    try{
        var pwmClient = await new mongoClient(mongo).connect();
        var item = await pwmClient.db("RhythmHub")
            .collection('Favourites')
            .insertOne({ user_id: new ObjectId(play.user_id), 
                name: play.plname, 
                description: play.pldesc, 
                song_ids: [], 
                tags: play.pltags, 
                visibility: play.plvis});
        res.send(item);
    } catch (e) {
        console.error(e); 
        res.status(500).send(`Errore generico: ${e}`);
    }
}

//remove song from playlist
async function removeFavorites(res, id, song_id){
    try{
        var pwmClient = await new mongoClient(mongo).connect()
        var filter = { "user_id": new ObjectId(id) }
        var update = {
            $pull: {song_ids: song_id}
        }
        var item = await pwmClient.db("RhythmHub")
            .collection('Favourites')
            .updateOne(filter, update)
        res.send(item)
    } catch (e) {
        res.status(500).send(`Errore generico: ${e}`)
    };
}

app.delete('/favorites/user/:id', auth, async (req, res) => {
    try{
    var id = req.params.id
    var pwmClient = await new mongoClient(mongo).connect()
    var favorites = await pwmClient.db("RhythmHub")
        .collection('Favourites')
        .deleteMany({ "user_id": new ObjectId(id) })
    res.json(favorites)
    }
    catch (error){
        console.error('Error occurred while fetching playlists:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
})

//show playlist by id on homepage
app.get('/favorites/show/:id', async (req,res) => {
    try{
    var pwmClient = await new mongoClient(mongo).connect()
    var favorites = await pwmClient.db("RhythmHub")
        .collection('Favourites')
        .find({"_id": new ObjectId(req.params.id)})
        .toArray()
        res.json(favorites)
    }
    catch (error){
        console.error('Error occurred while fetching playlists:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
})

// show public playlists on homepage
app.get('/favorites/showplay', async (req,res) => {
    try{
        var pwmClient = await new mongoClient(mongo).connect()
        var favorites = await pwmClient.db("RhythmHub")
            .collection('Favourites')
            .find({
                "visibility": "1",
                "imported_from": { $exists: false } // exclude documents where "imported_from" field exists
            })
            .toArray()
        const fav = JSON.stringify(favorites);
        res.json(JSON.parse(fav))
    } catch (error){
        console.error('Error occurred while fetching playlists:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
})

//show playlist by name on search page
app.get('/favorites/searchplay', async (req,res) => {
    var query=req.query.query
    try{
    var pwmClient = await new mongoClient(mongo).connect()
    var favorites = await pwmClient.db("RhythmHub")
        .collection('Favourites')
        .find({
            "name": query, 
            "visibility": "1",
            "imported_from": { $exists: false }
        })
        .toArray()
    res.json(favorites)
    }
    catch (error){
        console.error('Error occurred while fetching playlists:', error);
        res.status(404).json({ error: 'Not Found.' });
    }
})

//show playlist by tags on search page
app.get('/favorites/searchtags', async (req,res) => {
    var query = req.query.query.split(',').map(tag => tag.trim());
    try{
        var pwmClient = await new mongoClient(mongo).connect()
        var favorites = await pwmClient.db("RhythmHub")
            .collection('Favourites')
            .find({tags: {$all: query}, "visibility": "1"})
            .toArray()
        res.json(favorites)
    }
    catch (error){
        console.error('Error occurred while fetching playlists:', error);
        res.status(404).json({ error: 'Not Found.' });
    }
})

app.get('/favorites/:id', async (req, res) => {
    var id = req.params.id
    // Check if id is a valid 24-character hexadecimal string
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: 'Invalid id.' });
    }
    var pwmClient = await new mongoClient(mongo).connect()
    var favorites = await pwmClient.db("RhythmHub")
        .collection('Favourites')
        .find({ "user_id": new ObjectId(id) })
        .toArray()
    res.json(favorites)
})

app.post('/favorites/addsong/:id', auth, async (req, res) => {
    var id = req.params.id;
    var song_id = req.body.song_id;
    // console.log(song_id);
    // console.log(id);
    addFavorites(res, id, song_id);
})

// delete playlist by id
app.delete('/favorites/remove/:id', auth, async (req, res) => {
    deletePlaylist(res, req.params.id)
})

//delete song from playlist by song id 
app.delete('/favorites/:id', auth, async (req, res) => {
   var id = req.params.id
   song_id = req.body.song_id
//    console.log(song_id)
//    console.log(id)
   removeFavorites(res,id,song_id)
})

//create playlist
app.post('/favorites/create', async (req,res) => {
    //console.log(req.body)
    createPlaylist(res, req.body)
})

//check if the user (id) own a playlist
app.get('/favorites/chkpl/:id', auth, async (req,res) => {
    var id=req.params.id
    var pwmClient = await new mongoClient(mongo).connect()
    var favorites = await pwmClient.db("RhythmHub")
        .collection('Favourites')
        .findOne({ "user_id": new ObjectId(id) })
    // console.log(favorites)
    if(favorites==null){
        res.status(404).send("Playlist not found")
    }else{
        res.status(200).send("Playlist found")
    }
})


app.post('/favorites/import/:id', async (req,res) => {
    var plid=req.params.id
    var user=req.body.user

    try{
        var pwmClient = await new mongoClient(mongo).connect()
        var playlistToImport = await pwmClient.db("RhythmHub")
        .collection('Favourites')
        .findOne({ _id: new ObjectId(plid) });

        if(playlistToImport.user_id.toString() !== user){
            var newPlaylist = {
                user_id: new ObjectId(user),
                imported_from: playlistToImport.user_id,
                name: playlistToImport.name,
                description: playlistToImport.description,
                song_ids: playlistToImport.song_ids,
                tags: playlistToImport.tags,
                visibility: playlistToImport.visibility
            };

            var item = await pwmClient.db("RhythmHub")
            .collection('Favourites')
            .insertOne(newPlaylist);
            res.send(item);
        }else{
            res.status(401).send("Can't import your own playlist")
        }
    }catch(e){
        res.status(500).send(`Errore generico: ${e}`)
    }
})


