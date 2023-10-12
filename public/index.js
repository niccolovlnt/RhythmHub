var token=""
const client_ID = "ecd0dfc2d7f14d23a0ed755829e2ce3d"
const client_Secret = "561839255308440f9c7e5df1f04f2cb1"

var url ="https://accounts.spotify.com/api/token"
var page=0

function prev(){
    if (page>1){
        page=page-5
        getTop(page)
    }
}
function next(){
    if (page<45){
        page=page+5
        getTop(page)
    }
}
function prevS(){
    if (page>1){
        page=page-5
        ricerca(localStorage.getItem("query"), page)
    }
}
function nextS(){
    if (page<45){
        page=page+5
        ricerca(localStorage.getItem("query"), page)
    }
}

function getToken(){
    fetch(url, {
        method: "POST",
        headers: {
            Authorization: "Basic " + btoa(`${client_ID}:${client_Secret}`),
            "Content-Type": "application/x-www-form-urlencoded",
        },
    
        body: new URLSearchParams({ grant_type: "client_credentials" }), })
        .then((response) => response.json()) .then((tokenResponse) =>
            localStorage.setItem("token", tokenResponse.access_token)
          //Sarebbe opportuno salvare il token nel local storage
    )
}

function showTop(charts, page){
    document.getElementById('playname').innerHTML=charts.name
    document.getElementById('playfoll').innerHTML=("Followers: " +((charts.followers.total/1000000).toString().slice(0,5) +"M"))
    var card=document.getElementById("playlist-card")
    var container = document.getElementById("playlist-container")
    container.innerHTML = ""
    container.append(card)
    

    for(var i=page;i<page+4;i++) {
        if(charts.tracks.items[i].track.name!=""){
            var clone=card.cloneNode(true)
            clone.id = 'playlist-card-' + i
        }
        clone.getElementsByClassName('card-img-top')[0].src = charts.tracks.items[i].track.album.images[0].url
        clone.getElementsByClassName('card-title')[0].innerHTML = charts.tracks.items[i].track.name
        clone.getElementsByClassName('card-text')[0].innerHTML = charts.tracks.items[i].track.artists[0].name
        clone.getElementsByClassName('date')[0].innerHTML = charts.tracks.items[i].track.album.release_date
        clone.getElementsByClassName('album')[0].innerHTML=charts.tracks.items[i].track.album.name
        clone.getElementsByClassName('duration')[0].innerHTML=(Math.floor((charts.tracks.items[i].track.duration_ms/1000/60) << 0)).toString() +":"+ (Math.floor((charts.tracks.items[i].track.duration_ms/1000) % 60)).toString()
        clone.getElementsByClassName('btn-secondary')[0].href="song.html?id_song="+charts.tracks.items[i].track.id
        clone.classList.remove('d-none')
        card.before(clone)
    }
}

function getTop(page){
     fetch(`https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF?market=IT&limit=50&offset=${page}`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
    })
    .then(response => {
        // if (!response.ok) {
        //     response.json().then(data => alert(data.status_message))
        //     return
        // }
        response.json().then(charts => showTop(charts, page))
    })
    //.catch(error => alert(error))
}

function ricerca(query, page){
    localStorage.setItem("query", query)
    if(query.length>1){
        //console.log(query)
        fetch(`https://api.spotify.com/v1/search?q=${query}&type=track%2Cartist&market=IT&limit=50&offset=${page}`,{
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
        })
        .then(response => {
            // if (!response.ok) {
            //     response.json().then(data => alert(data.status_message))
            //     return
            // }
            response.json().then(charts => showSearch(charts, page))
        })
        //.catch(error => alert(error))
    }
}

function showSearch(charts, page){
    var picker=document.getElementById("picker")
    picker.classList.remove('d-none')
    var card=document.getElementById("playlist-card")
    var container = document.getElementById("playlist-container")
    container.innerHTML = ""
    container.append(card)
    
    for(var i=page;i<page+4;i++) {
        if(charts.tracks.items[i].name!=""){
            var clone=card.cloneNode(true)
            clone.id = 'playlist-card-' + i
        }
        clone.getElementsByClassName('card-img-top')[0].src = charts.tracks.items[i].album.images[0].url
        clone.getElementsByClassName('card-title')[0].innerHTML = charts.tracks.items[i].name
        clone.getElementsByClassName('card-text')[0].innerHTML = charts.tracks.items[i].artists[0].name
        clone.getElementsByClassName('date')[0].innerHTML = charts.tracks.items[i].album.release_date
        clone.getElementsByClassName('album')[0].innerHTML=charts.tracks.items[i].album.name
        clone.classList.remove('d-none')
        card.before(clone)
    }
}

function getSong(id){
    fetch(`https://api.spotify.com/v1/tracks/${id}`,{
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
        },
    })
    .then(response => {
        if (!response.ok) {
            response.json().then(data => alert(data.status_message))
            return
        }
        response.json().then(song => showSong(song))
    })
    .catch(error => alert(error))
}
function showSong(song){
    console.log(song)
    document.getElementById("tit").innerHTML=song.name
    document.getElementById("img").src=song.album.images[0].url
    document.getElementById("art").innerHTML=song.artists[0].name
    document.getElementById("alb").innerHTML=song.album.name
    document.getElementById("date").innerHTML=song.album.release_date
    document.getElementById("dur").innerHTML=(Math.floor((song.duration_ms/1000/60) << 0)).toString() +":"+ (Math.floor((song.duration_ms/1000) % 60)).toString()
    document.getElementById("gen").innerHTML=song.popularity
}