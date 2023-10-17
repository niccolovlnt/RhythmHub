const menuItems = [
    { label: "Home", link: "home.html" },
    { label: "Log In", link: "login.html" },
    { label: "Sign Up", link: "signup.html" },
    { label: "Search", link: "search.html"},
]
const loggedMenuItems=[
    { label: "Home", link: "home.html" },
    { label: "Search", link: "search.html"},
]
var dropdown="<div></div>"

if(localStorage.getItem('user')!=null){
    var user = JSON.parse(localStorage.getItem('user'))
    //console.log(localStorage.getItem('user'))
    //console.log(user)
    //var filter=menuItems.filter(item => item.label !=="Log In")
    var dropdown = `
        <div class="nav-item dropdown d-flex">
            <button class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown">
                Welcome ${user.name}
            </button>
            <ul class="dropdown-menu ms-auto me-2">
                <li>
                    <a class="dropdown-item" href="playlist.html">My Playlists</a>
                    <a class="dropdown-item" href="settings.html">My Account</a>
                    <a class="dropdown-item" onclick="logout()">Logout</a>
                </li>
            </ul>
        </div>`;
}
var menuHTML = "";
for (let i = 0; i < menuItems.length; i++) {
    let item = menuItems[i];
    menuHTML += `<li class="nav-item"><a class="nav-link" href="${item.link}">${item.label}</a></li>`;
}
var loggedMenuHTML="";
for (let i = 0; i < loggedMenuItems.length; i++) {
    let item = loggedMenuItems[i];
    loggedMenuHTML += `<li class="nav-item"><a class="nav-link" href="${item.link}">${item.label}</a></li>`;
}
function logout(){
    localStorage.removeItem("user");
    window.location.href = "http://127.0.0.1:3000/login.html"
}

const menuElement = document.getElementById('menu');
if(localStorage.getItem('user')!=null){
    menuElement.innerHTML=`<nav class="navbar bg-primary">
    <div class="container-fluid">
    <div class="navbar-brand d-flex justify-content-start">
        
        <img src="iconPNG.png" alt="Logo" width="35" height="35" class="align-text-top">
        <span class="d-none d-sm-none d-md-inline">RhythmHub</span>
    </div>
    <div class="d-flex justify-content-end">
        ${dropdown}
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <ul class="navbar-nav flex-column">
            ${loggedMenuHTML}
            </ul>
        </div>
    </div>
    </div>
</nav>`;
}else{
    menuElement.innerHTML=`
<nav class="navbar bg-primary">
    <div class="container-fluid">
    <div class="navbar-brand d-flex justify-content-start">
        
        <img src="iconPNG.png" alt="Logo" width="35" height="35" class="align-text-top">
        <span class="d-none d-sm-none d-md-inline">RhythmHub</span>
    </div>
    <div class="d-flex justify-content-end">
        ${dropdown}
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <ul class="navbar-nav flex-column">
            ${menuHTML}
            </ul>
        </div>
    </div>
    </div>
</nav>`;
}