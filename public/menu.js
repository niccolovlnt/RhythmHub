const menuItems = [
    { label: "Log In", link: "login.html" },
    { label: "Sign Up", link: "signup.html" },
]
const loggedMenuItems=[
    { label: "Home", link: "home.html" },
    { label: "Search", link: "search.html"},
    { label: "My Playlists", link: "playlist.html"},
    { label: "My Account", link: "settings.html"},
]
var dropdown="<div></div>"

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
    fetch('/logout')
    window.location.href='/login.html'
} 

const menuElement = document.getElementById('menu');
if(localStorage.getItem('user')!=null){
    menuElement.innerHTML=`
    <nav class="navbar bg-primary fixed-top">
    <div class="container-fluid">
    <div class="navbar-brand">
        <img src="iconPNG.png" alt="Logo" width="35" height="35">
        <span style="color: white; margin 5px; margin-top: 5px;">RhythmHub</span>
    </div>

      <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
          ${loggedMenuHTML}
          <li onclick="logout()"> Logout </li>
          </ul>
        </div>
      </div>




    </div>
</nav>`;
}else{
    menuElement.innerHTML=`
    <nav class="navbar bg-primary fixed-top">
    <div class="container-fluid">
    <div class="navbar-brand">
        <img src="iconPNG.png" alt="Logo" width="35" height="35">
        <span style="color: white; margin 5px; margin-top: 5px;">RhythmHub</span>
    </div>

      <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
        <div class="offcanvas-header">
          <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Menu</h5>
          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
          ${menuHTML}
          </ul>
        </div>
      </div>
      `;
}