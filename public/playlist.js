const playlistElement = document.getElementById('playlistElement');
if(localStorage.getItem('user')!=null){
    var user = JSON.parse(localStorage.getItem('user'))
    var id=user._id
    fetch(`/favorites/chkpl/${id}`)
        .then(response => {
            // console.log(response)
            if(response.status === 200){
                playlistElement.innerHTML=okplaylist
                fetch(`/favorites/${id}`)
                .then(response => {
                    if(response.status === 200){
                        response.json().then(data => {
                            // console.log(data)
                            var plname=document.getElementById('plname')
                            var pldesc=document.getElementById('pldesc')
                            var username=document.getElementById('username')
                            document.getElementById('htag').classList.remove('d-none')
                            plname.innerHTML=data.name
                            pldesc.innerHTML=data.description
                            username.innerHTML=user.username
                        })
                    }
                })
                .catch(error => {
                    console.log(error)
                })

            } else if (response.status === 404) {
                playlistElement.innerHTML=noplaylist
            } else {
                console.log('Unhandled status code:', response.status);
            }
        })
        .catch(error => {
            console.log(error)
        })
}

var noplaylist=`
<div class="row p-3 g-2 d-flex">
        <div class="col-sm-12 mb-3 mb-sm-0">
          <div class="card">
            <div class="card-body">
              <h5 class="card-title">No playlists yet</h5>
              <p class="card-text">Create your first playlist now. </p>
              <!--<a class="btn btn-primary" onclick="createPl()">Create here</a> -->

              <!-- Button trigger modal -->
              <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Create a new one here</button>

              <!-- Modal -->
                <div class="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-header">
                            <h1 class="modal-title fs-5" id="staticBackdropLabel">New Playlist</h1>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">

                        <div class="form-floating mb-3">
                            <input class="form-control" id="plname" placeholder="Playlist Name">
                            <label for="floatingInput">Playlist Name</label>
                        </div>

                        <div class="form-floating mb-3">
                            <textarea class="form-control" placeholder=Description id="pldesc"></textarea>
                            <label for="floatingTextarea">Description</label>
                        </div>

                        <div class="form-floating mb-3">
                        <textarea class="form-control" placeholder=Tags id="pltags"></textarea>
                        <label for="floatingTextarea">Tags</label>
                        </div>

                        <div class="form-floating">
                        <select class="form-select" id="plvis" aria-label="Visibility">
                          <option selected>Open this select menu</option>
                          <option value="1">Public</option>
                          <option value="2">Private</option>
                        </select>
                        <label for="floatingSelect">Visibility</label>
                        </div>



                        </div>
                        <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onclick="createPl()">Create</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
</div>
`
var okplaylist=`
<div class="row p-3 g-2">
        <div class="col-sm-12 mb-3 mb-sm-0">
          <div class="card">
            <div class="card-body">
            <h5 class="card-title"> <span id="plname"></span> <span id="htag" class="d-none" style="font-size: smaller; opacity: 0.5;"> by @<span id="username"></span></span></h5>
            <p class="card-text" id="pldesc"></p>
              <a class="btn btn-primary p-2" ${localStorage.getItem('song_id') ? '' : 'style="display: none;"'} onclick="addSong()">Add song</a>
              <a class="btn btn-secondary p-2" onclick="deletePl()">Delete Playlist</a>
              <!-- Button trigger modal -->
              <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onclick="showPl()">Show Songs</button>

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

                            <div class="card-footer">
                                <div class="d-flex justify-content-end">
                                    <button class="btn btn-primary p-2 rmsong" onclick="deleteSg(this.dataset.songId)" data-song-id="">Remove song</button>
                                </div>
                            </div>                        
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
</div>
`
function createPl() {
    var user = JSON.parse(localStorage.getItem('user'));
    var playlistName = document.getElementById('plname').value;
    var playlistDesc = document.getElementById('pldesc').value;
    var playlistTags = document.getElementById('pltags').value;
    var tagsArray = playlistTags.split(',').map(tag => tag.trim());
    var plvis = document.getElementById('plvis').value;
    var playlist = {
        user_id: user._id,
        plname: playlistName,
        pldesc: playlistDesc,
        pltags: tagsArray,
        plvis: plvis
    };
    fetch('/favorites/create', {
            method: 'POST',
            headers: {
                    'Content-Type': 'application/json'
            },
            body: JSON.stringify(playlist)
        })
        .then(response => {
            if (response.ok) {
                window.location.href = '/playlist.html';
            }
        })
        .catch(error => {
            console.log(error);
        });
    return
}

function addSong() {
    fetch(`/favorites/addsong/${user._id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ song_id: localStorage.getItem('song_id') })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Failed to add song to playlist');
        }
    })
    .then(data => {
        localStorage.removeItem('song_id');
        alert('Song added to playlist');
        window.location.href = '/playlist.html';
    })
    .catch(error => {
        console.log(error);
    });
}

async function showPl(){
    var user = JSON.parse(localStorage.getItem('user'))
    var id=user._id
    try {
        let response = await fetch(`/favorites/${id}`)
        if(response.status === 200){
            let data = await response.json()
            var plname=document.getElementById('plnamemodal')
            var pldesc=document.getElementById('pldescmodal')
            var pltags=document.getElementById('pltagsmodal')
            var plvis=document.getElementById('plvismodal')
            var card=document.getElementById('song-card')
            plname.innerHTML=data.name
            pldesc.innerHTML= "Description: "+data.description
            pltags.innerHTML= "Tags: "
            for(let i=0; i<data.tags.length; i++){
                if(i!=0){
                pltags.innerHTML+=", "+data.tags[i]
                }else{
                    pltags.innerHTML+=data.tags[i]
                }
            }
            if(data.visibility == 1){
                plvis.innerHTML="Public"
            }else{
                plvis.innerHTML="Private"
            }
            

            for (let i = 0; i < data.song_ids.length; i++) {
                let songResponse = await fetch(`/spoty/song/${data.song_ids[i]}`)
                if(songResponse.status === 200){
                    let songData = await songResponse.json()
                    var clone=card.cloneNode(true)
                    clone.id = 'playlist-card-' + i
                    clone.getElementsByClassName('song-title')[0].innerHTML=songData.name
                    clone.getElementsByClassName('song-artist')[0].innerHTML=songData.artists[0].name
                    clone.getElementsByClassName('song-im')[0].src=songData.album.images[0].url
                    clone.getElementsByClassName('rmsong')[0].setAttribute('data-song-id', data.song_ids[i])
                    clone.classList.remove('d-none')
                    card.after(clone)
                }
            }
        }
    } catch(error) {
        console.log(error)
    }
}

function deletePl(){
    fetch(`/favorites/remove/${user._id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/playlist.html';
        }
    })
    .catch(error => {
        console.log(error);
    });
    
}

function deleteSg(songid){
    fetch(`/favorites/${user._id}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ song_id: songid})
    })
    .then(response => {
        if (response.ok) {
            window.location.href = '/playlist.html';
        }
    })
    .catch(error => {
        console.log(error)
    })
}