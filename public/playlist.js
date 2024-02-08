const playlistElement = document.getElementById('playlistElement');

//display playlist card when accessing the page
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
                        response.json().then(async data => {
                            var card=document.getElementById('pl-card')
                            var container=document.getElementById('pl-cont')
                            container.innerHTML = "" // Clear the container
                            container.append(card)
                            for (let i=0;i<data.length;i++){
                                if(data[i].name != ''){
                                    var clone=card.cloneNode(true)
                                    clone.id = 'pl-card-' + i
                                }
                                clone.getElementsByClassName('plname')[0].innerHTML = data[i].name
                                clone.getElementsByClassName('pldesc')[0].innerHTML = data[i].description
                                clone.getElementsByClassName('username')[0].innerHTML = user.username
                                clone.getElementsByClassName('htag')[0].classList.remove('d-none')
                                if(data[i].imported_from){
                                    clone.getElementsByClassName('imported')[0].innerHTML = "imported from: " + await getUser(data[i].imported_from)
                                    clone.getElementsByClassName('imported')[0].classList.remove('d-none')
                                }
                                clone.getElementsByClassName('songid')[0].href = data[i]._id
                                clone.getElementsByClassName('pl-id')[0].href = data[i]._id
                                clone.classList.remove('d-none')
                                card.before(clone)
                            
                                // Clone the modal for each playlist
                                var modalTemplate = document.getElementById('staticBackdrop');
                                var modal = modalTemplate.cloneNode(true);
                                modal.id = 'modal-' + i;
                            
                                // Update the modal's content
                                var plname = modal.querySelector('#plnamemodal');
                                var pldesc = modal.querySelector('#pldescmodal');
                                var pltags = modal.querySelector('#pltagsmodal');
                                var plvis = modal.querySelector('#plvismodal');
                            
                                plname.innerHTML = data[i].name;
                                pldesc.innerHTML = "Description: " + data[i].description;
                                pltags.innerHTML = "Tags: " + data[i].tags.join(', ');
                                plvis.innerHTML = data[i].visibility == 1 ? "Public" : "Private";
                                
                                // Update the "Show Songs" button to target the correct modal
                                var showSongsButton = clone.querySelector('[data-bs-toggle="modal"]');
                                showSongsButton.setAttribute('data-bs-target', '#modal-' + i);
                            
                                // Append the modal to the document body
                                document.body.appendChild(modal);
                            
                                // Use an IIFE to create a new scope for each iteration of the loop
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
                                                
                                                (function(i, modal) {
                                                    var deleteButton = songCard.getElementsByClassName('rmsong')[0];
                                                    deleteButton.setAttribute('data-song-id', data[i].song_ids[k]);
                                                    deleteButton.addEventListener('click', function(event) {
                                                        var songId = event.target.getAttribute('data-song-id');
                                                        deleteSg(songId);
                                                    });
                                                })(i, modal);
                                                
                                                
                                                songCard.classList.remove('d-none');
                                                modalBody.appendChild(songCard);
                                            })
                                            .catch(error => {
                                                console.log(error)
                                            });
                                    }
                                })(i, modal);
                            }
                            card.remove()
                            card.remove()
                            card.remove()
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

        <div class="container"> 
        <div class="card mt-3">
            <div class="card-body">
                <a type="button" class="btn btn-primary w-100" data-bs-toggle="modal" data-bs-target="#staticBackdrop2">Create a new one here</a>
            </div>
        </div>
        </div>

        <!-- Modal -->
        <div class="modal fade" id="staticBackdrop2" data-bs-backdrop="static" data-bs-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
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


        <div class="container" id="pl-cont">
        <div class="card mt-3" id="pl-card">
            <div class="card-body">
            <h5 class="card-title"> <span id="plname" class="plname"></span> <span id="htag" class="htag d-none" style="font-size: smaller; opacity: 0.5;"> by @<span id="username" class="username"></span></span></h5>
            <p class="card-text imported" style="opacity: 50%;"></p>
            <p class="card-text pldesc" id="pldesc"></p>
            <a href="#" class="btn btn-primary p-2 songid" ${localStorage.getItem('song_id') ? '' : 'style="display: none;"'} onclick="addSong(this.getAttribute('href')); return false;">Add song</a>
            <a href="#" class="btn btn-secondary p-2 pl-id" onclick="deletePl(this.getAttribute('href')); return false;")">Delete Playlist</a>
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

                            <div class="card-footer">
                                <div class="d-flex justify-content-end">
                                    <button class="btn btn-primary p-2 rmsong" data-song-id="">Remove song</button>
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

// add song to playlist
function addSong(playId) {
    fetch(`/favorites/addsong/${playId}`, {
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


// delete playlist by id, works for multiple too
function deletePl(playlistId){
    console.log(playlistId);
    fetch(`/favorites/remove/${playlistId}`, {
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

// delete song from playlist, to fix yet
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

//display username from user id
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