// Purpose: This file contains the functions that are used to display the data from the API on the front end.

function showTop(charts){
    var pg=parseInt(localStorage.getItem("page"), 10) || 0
    document.getElementById('playname').innerHTML=charts.name
    document.getElementById('playfoll').innerHTML=("Followers: " +((charts.followers.total/1000000).toString().slice(0,5) +"M"))
    var card=document.getElementById("playlist-card")
    var container = document.getElementById("playlist-container")
    container.innerHTML = ""
    container.append(card)
    
    for(var i=pg;i<pg+4;i++) {
        if(charts.tracks.items[i].track.name!=""){
            var clone=card.cloneNode(true)
            clone.id = 'playlist-card-' + i
        }
        clone.getElementsByClassName('card-img-top')[0].src = charts.tracks.items[i].track.album.images[0].url
        clone.getElementsByClassName('card-title')[0].innerHTML = charts.tracks.items[i].track.name
        clone.getElementsByClassName('card-text')[0].innerHTML = charts.tracks.items[i].track.artists[0].name
        clone.getElementsByClassName('date')[0].innerHTML = charts.tracks.items[i].track.album.release_date
        clone.getElementsByClassName('album')[0].innerHTML=charts.tracks.items[i].track.album.name

        let minutes = Math.floor( charts.tracks.items[i].track.duration_ms/ 1000 / 60);
        let seconds = Math.floor((charts.tracks.items[i].track.duration_ms / 1000) % 60);
        if(seconds < 10){
            clone.getElementsByClassName('duration')[0].innerHTML=minutes.toString() + ":0" + seconds.toString();
        }else{
            clone.getElementsByClassName('duration')[0].innerHTML=minutes.toString() + ":" + seconds.toString();
        }
        clone.getElementsByClassName('btn-secondary')[0].href="song.html?id_song="+charts.tracks.items[i].track.id
        clone.getElementsByClassName('btn-primary')[0].href=charts.tracks.items[i].track.id
        clone.classList.remove('d-none')
        card.before(clone)
    }
}
function showSearch(charts){
    var pg=parseInt(localStorage.getItem("page"), 10) || 0
    var picker=document.getElementById("picker")
    picker.classList.remove('d-none')
    var card=document.getElementById("playlist-card")
    var container = document.getElementById("playlist-container")
    container.innerHTML = ""
    container.append(card)
    
    for(var i=pg;i<pg+4;i++) {
        if(charts.tracks.items[i].name!=""){
            var clone=card.cloneNode(true)
            clone.id = 'playlist-card-' + i
        }
        clone.getElementsByClassName('card-img-top')[0].src = charts.tracks.items[i].album.images[0].url
        clone.getElementsByClassName('card-title')[0].innerHTML = charts.tracks.items[i].name
        clone.getElementsByClassName('card-text')[0].innerHTML = charts.tracks.items[i].artists[0].name
        clone.getElementsByClassName('date')[0].innerHTML = charts.tracks.items[i].album.release_date
        clone.getElementsByClassName('album')[0].innerHTML=charts.tracks.items[i].album.name
        clone.getElementsByClassName('btn-secondary')[0].href="song.html?id_song="+charts.tracks.items[i].id
        clone.getElementsByClassName('btn-primary')[0].href=charts.tracks.items[i].id     
        clone.classList.remove('d-none')
        card.before(clone)
    }
}
function showSong(song){
    document.getElementById("tit").innerHTML=song.name
    document.getElementById("img").src=song.album.images[0].url
    document.getElementById("art").innerHTML=song.artists[0].name
    document.getElementById("alb").innerHTML=song.album.name
    document.getElementById("date").innerHTML=song.album.release_date
    let minutes = Math.floor(song.duration_ms / 1000 / 60);
    let seconds = Math.floor((song.duration_ms / 1000) % 60);
    if(seconds < 10){
        document.getElementById("dur").innerHTML = minutes.toString() + ":0" + seconds.toString();
    }else{
        document.getElementById("dur").innerHTML = minutes.toString() + ":" + seconds.toString();
    }
    document.getElementById("gen").innerHTML=song.popularity
}

function addSong(id){
    localStorage.setItem("song_id", id)
    console.log(id);
    fetch('/playlist')
    .then(response => {
      window.location.href = response.url
    })
}

// function to  show playlist on homepage
async function showPls(charts){
    var card=document.getElementById("fav-card")
    var container = document.getElementById("fav-container")
    container.innerHTML = ""
    container.append(card)
    
    for(var i=0;i<charts.length;i++) {
        if(charts[i].name != ''){
        var clone=card.cloneNode(true)
        clone.id = 'playlist-card-' + i
        }
        clone.getElementsByClassName('favcard-title')[0].innerHTML = charts[i].name
        clone.getElementsByClassName('favcard-text')[0].innerHTML = "by @" + await getUser(charts[i].user_id)
        clone.getElementsByClassName('favtags')[0].innerHTML = "Tags: "
        for(let j=0; j<charts[i].tags.length; j++){
            if(j == 0) {
                clone.getElementsByClassName('favtags')[0].innerHTML += charts[i].tags[j];
            } else {
                clone.getElementsByClassName('favtags')[0].innerHTML += ", " + charts[i].tags[j];
            }
        }
        clone.getElementsByClassName('fav1')[0].href=charts[i]._id
        clone.getElementsByClassName('fav2')[0].href=charts[i]._id
        clone.querySelector('a').href = "user.html?id_user=" + charts[i].user_id;
        clone.classList.remove('d-none')
        card.before(clone)
    }
}

//function to open modal related to playlist
async function showPlHm(id){
    try{
        var response = await fetch(`/favorites/show/${id}`)
        var data = await response.json()
        var plname=document.getElementById('plnamemodal')
        var pldesc=document.getElementById('pldescmodal')
        var pltags=document.getElementById('pltagsmodal')
        var plvis=document.getElementById('plvismodal')
        var container = document.getElementById("song-container")
        var card=document.getElementById('song-card')
        plname.innerHTML=data[0].name
        pldesc.innerHTML= "Description: "+data[0].description
        pltags.innerHTML= "Tags: "
        for(let i=0; i<data[0].tags.length; i++){
            if(i!=0){
            pltags.innerHTML+=", "+data[0].tags[i]
            }else{
                pltags.innerHTML+=data[0].tags[i]
            }
        }
        if(data[0].visibility == 1){
            plvis.innerHTML="Public"
        }else{
            plvis.innerHTML="Private"
        }
        container.innerHTML = "" // Clear the container
        container.append(card)
        for (let i = 0; i < data[0].song_ids.length; i++) {
            let songResponse = await fetch(`/spoty/song/${data[0].song_ids[i]}`)
            if(songResponse.status === 200){
                let songData = await songResponse.json()
                var clone=card.cloneNode(true)
                clone.id = 'playlist-card-' + i
                clone.getElementsByClassName('song-title')[0].innerHTML=songData.name
                clone.getElementsByClassName('song-artist')[0].innerHTML=songData.artists[0].name
                clone.getElementsByClassName('song-im')[0].src=songData.album.images[0].url
                clone.classList.remove('d-none')
                card.after(clone)
            }
        }
    }
    catch(err){
        console.log(err);
    }
}

async function getUser(id){
    return fetch("/users")
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json()
    })
    .then(data => {
        for (let i = 0; i < data.length; i++) {
            if(data[i]._id == id){
                return data[i].username
            }
        }
    })
    .catch(err => {
        console.log(err);
    })
}

async function showSearchPlay(charts){
    var picker=document.getElementById("picker")
    picker.classList.add('d-none')
    var card=document.getElementById("playlist-card")
    var container = document.getElementById("playlist-container")
    container.innerHTML = ""
    container.append(card)

    for(var i=0;i<charts.length;i++) {
        if(charts[i].name != ''){
        var clone=card.cloneNode(true)
        clone.id = 'playlist-card-' + i
        }
        clone.getElementsByClassName('card-title')[0].innerHTML = charts[i].name
        clone.getElementsByClassName('card-text')[0].innerHTML = "by @" + await getUser(charts[i].user_id)
        clone.getElementsByClassName('date')[0].innerHTML = "Tags: "
        for(let j=0; j<charts[i].tags.length; j++){
            if(j == 0) {
                clone.getElementsByClassName('date')[0].innerHTML += charts[i].tags[j];
            } else {
                clone.getElementsByClassName('date')[0].innerHTML += ", " + charts[i].tags[j];
            }
        }
        //clone.getElementsByClassName('fav1')[0].href=charts[i]._id
        clone.getElementsByClassName('fav2')[0].href=charts[i]._id
        clone.getElementsByClassName('fav4')[0].href=charts[i]._id
        clone.querySelector('a').href = "user.html?id_user=" + charts[i].user_id;
        clone.classList.remove('d-none')
        card.before(clone)
    }
}

async function showSearchTags(charts){
    var picker=document.getElementById("picker")
    picker.classList.add('d-none')
    var card=document.getElementById("playlist-card")
    var container = document.getElementById("playlist-container")
    container.innerHTML = ""
    container.append(card)

    for(var i=0;i<charts.length;i++) {
        if(charts[i].name != ''){
        var clone=card.cloneNode(true)
        clone.id = 'playlist-card-' + i
        }
        clone.getElementsByClassName('card-title')[0].innerHTML = charts[i].name
        clone.getElementsByClassName('card-text')[0].innerHTML = "by @" + await getUser(charts[i].user_id)
        clone.getElementsByClassName('date')[0].innerHTML = "Tags: "
        for(let j=0; j<charts[i].tags.length; j++){
            if(j == 0) {
                clone.getElementsByClassName('date')[0].innerHTML += charts[i].tags[j];
            } else {
                clone.getElementsByClassName('date')[0].innerHTML += ", " + charts[i].tags[j];
            }
        }
        //clone.getElementsByClassName('fav1')[0].href=charts[i]._id
        // clone.getElementsByClassName('fav2')[0].href=charts.tracks.items[i].track.id
        clone.getElementsByClassName('fav2')[0].href=charts[i]._id
        clone.getElementsByClassName('fav4')[0].href=charts[i]._id
        clone.querySelector('a').href = "user.html?id_user=" + charts[i].user_id;
        clone.classList.remove('d-none')
        card.before(clone)
    }
}

async function showUserPlay(data){
    if(data.length>0){
        var code=`
        <div class="container" id="pl-cont">
        <div class="card mt-3" id="pl-card">
            <div class="card-body">
            <h5 class="card-title"> <span id="plname" class="plname"></span> <span id="htag" class="htag d-none" style="font-size: smaller; opacity: 0.5;"> by @<span id="username" class="username"></span></span></h5>
            <p class="card-text imported" style="opacity: 50%;"></p>
            <p class="card-text pldesc" id="pldesc"></p>
              <!-- Button trigger modal -->
              <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Show Songs</button>

              <!-- Modal -->
                <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                            <h1 class="modal-title fs-5" id="plnamemodal"></h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                        <p id="pldescmodal"></p>
                        <p id="pltagsmodal"></p>
                        <p id="plvismodal"></p>
 
                        <div class="card d-none" id="song-card">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-sm-6">
                                        <img class="song-im" src="" alt="Image" style="max-width: 50%; height: auto; border-radius: 50%;">
                                    </div>
                                    <div class="col-sm-6 text-center">
                                        <h3 class="song-title"></h3>
                                        <p class="song-artist"></p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                        </div>
                    </div>
                </div>
            </div>
          </div>
          </div>
        </div>
        `
        document.getElementById('play').innerHTML=code
        var card=document.getElementById('pl-card')
        var container=document.getElementById('pl-cont')
        container.innerHTML = "" // Clear the container
        container.append(card)
        for(let i=0;i<data.length;i++){
            if(data[i].name != ''){
                var clone=card.cloneNode(true)
                clone.id = 'pl-card-' + i
            }
            clone.getElementsByClassName('plname')[0].innerHTML = data[i].name
            clone.getElementsByClassName('pldesc')[0].innerHTML = data[i].description
            clone.getElementsByClassName('username')[0].innerHTML = await getUser(data[i].user_id)
            clone.getElementsByClassName('htag')[0].classList.remove('d-none')
            if(data[i].imported_from){
                clone.getElementsByClassName('imported')[0].innerHTML = "imported from: " + await getUser(data[i].imported_from)
                clone.getElementsByClassName('imported')[0].classList.remove('d-none')
            }
            //clone.getElementsByClassName('songid')[0].href = data[i]._id
            //clone.getElementsByClassName('pl-id')[0].href = data[i]._id
            clone.classList.remove('d-none')
            card.before(clone)

            var modalTemplate = document.getElementById('staticBackdrop');
            var modal = modalTemplate.cloneNode(true);
            modal.id = 'modal-' + i;

            var plname = modal.querySelector('#plnamemodal');
            var pldesc = modal.querySelector('#pldescmodal');
            var pltags = modal.querySelector('#pltagsmodal');
            var plvis = modal.querySelector('#plvismodal');

            plname.innerHTML = data[i].name;
            pldesc.innerHTML = "Description: " + data[i].description;
            pltags.innerHTML = "Tags: " + data[i].tags.join(', ');
            plvis.innerHTML = data[i].visibility == 1 ? "Public" : "Private";

            var showSongsButton = clone.querySelector('[data-bs-toggle="modal"]');
            showSongsButton.setAttribute('data-bs-target', '#modal-' + i);
            document.body.appendChild(modal);
            // var myModal = new bootstrap.Modal(document.getElementById('modal-' + i));
            
            (function(i, modal) {
                for (let k = 0; k < data[i].song_ids.length; k++) {
                    fetch(`/spoty/song/${data[i].song_ids[k]}`)
                        .then(songResponse => {
                            if(songResponse.status === 200){
                                return songResponse.json();
                            } else {
                                throw new Error('Error status: ' + songResponse.status);
                            }
                        })
                        .then(songData => {
                            // Append the songs to the correct modal
                            var songCardTemplate = modal.querySelector('#song-card');
                            var modalBody = modal.querySelector('.modal-body');
        
                            var songCard = songCardTemplate.cloneNode(true);
                            songCard.id = 'playlist-card-' + i;
                            songCard.getElementsByClassName('song-title')[0].innerHTML = songData.name;
                            songCard.getElementsByClassName('song-artist')[0].innerHTML = songData.artists[0].name;
                            songCard.getElementsByClassName('song-im')[0].src = songData.album.images[0].url;
                            
                            songCard.classList.remove('d-none');
                            modalBody.appendChild(songCard);
                        })
                        .catch(error => {
                            console.log(error)
                        });
                }
            })(i, modal);
        }
        card.remove();
        card.remove();
        card.remove();
    }else{
        document.getElementById('play').innerHTML=`
        <div class="card">
            <div class="card-body">
                <h5 class="card-title text-center">No playlists created by the user.</h5>
            </div>
        </div>`
    }
}