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
    

    for(var i=page;i<page+6;i++) {
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
        if (!response.ok) {
            response.json().then(data => alert(data.status_message))
            return
        }
        response.json().then(charts => showTop(charts, page))
    })
    .catch(error => alert(error))
}



