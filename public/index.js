// Purpose: This file contains the functions that are used to display the data from the API on the front end.

var showHTMl=`

`



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

async function showPls(charts){
    // var pg=parseInt(localStorage.getItem("page"), 10) || 0
    // document.getElementById('playname').innerHTML=charts.name
    // document.getElementById('playfoll').innerHTML=("Followers: " +((charts.followers.total/1000000).toString().slice(0,5) +"M"))
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
        // clone.getElementsByClassName('fav2')[0].href=charts.tracks.items[i].track.id
        clone.classList.remove('d-none')
        card.before(clone)
    }
}

async function showPlHm(id){
    try{
        var response = await fetch(`/favorites/show/${id}`)
        var data = await response.json()
        console.log(data)
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