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
loggedMenuHTML += `<li class="nav-item"><a class="nav-link" onclick="logout()">Logout</a></li>`;

function logout(){
    localStorage.clear()
    fetch('/logout')
    window.location.href='/login.html'
} 

const menuElement = document.getElementById('menu');
if(localStorage.getItem('user')!=null){
    menuElement.innerHTML=`
    <nav class="navbar bg-primary fixed-top">
    <div class="container-fluid">
    <div class="navbar-brand d-flex align-items-center">
    <a href="home.html">
    <img src="iconPNG.png" alt="Logo" width="35" height="35">
    <span style="color: white; margin-left: 5px;">RhythmHub</span>
    </a>
    </div>  

    <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation" style="border: none; border-radius: 0;">
    <svg class="navbar-toggler-icon" style="background-image: none !important;" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
      <path fill="white" d="M 0 9 L 0 11 L 50 11 L 50 9 Z M 0 24 L 0 26 L 50 26 L 50 24 Z M 0 39 L 0 41 L 50 41 L 50 39 Z"></path>
    </svg>
    </button>
      <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasNavbar" aria-labelledby="offcanvasNavbarLabel">
        <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Menu <span style="opacity: 50%;">- ${JSON.parse(localStorage.getItem('user')).username}</span></h5>          <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
        </div>
        <div class="offcanvas-body">
          <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
          ${loggedMenuHTML}
          </ul>
        </div>
      </div>
    </div>
</nav>`;
}else{
  menuElement.innerHTML=`
  <nav class="navbar bg-primary fixed-top">
  <div class="container-fluid">
  <div class="navbar-brand d-flex align-items-center">
      <img src="iconPNG.png" alt="Logo" width="35" height="35">
      <span style="color: white; margin-left: 5px;">RhythmHub</span>
  </div>
  <button class="navbar-toggler" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasNavbar" aria-controls="offcanvasNavbar" aria-label="Toggle navigation" style="border: none; border-radius: 0;">
  <svg class="navbar-toggler-icon" style="background-image: none !important;" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="100" height="100" viewBox="0 0 50 50">
    <path fill="white" d="M 0 9 L 0 11 L 50 11 L 50 9 Z M 0 24 L 0 26 L 50 26 L 50 24 Z M 0 39 L 0 41 L 50 41 L 50 39 Z"></path>
  </svg>
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
    </nav>
    `;
}