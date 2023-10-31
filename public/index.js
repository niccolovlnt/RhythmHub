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
        clone.getElementsByClassName('duration')[0].innerHTML=(Math.floor((charts.tracks.items[i].track.duration_ms/1000/60) << 0)).toString() +":"+ (Math.floor((charts.tracks.items[i].track.duration_ms/1000) % 60)).toString()
        clone.getElementsByClassName('btn-secondary')[0].href="song.html?id_song="+charts.tracks.items[i].track.id
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
    document.getElementById("dur").innerHTML=(Math.floor((song.duration_ms/1000/60) << 0)).toString() +":"+ (Math.floor((song.duration_ms/1000) % 60)).toString()
    document.getElementById("gen").innerHTML=song.popularity
}