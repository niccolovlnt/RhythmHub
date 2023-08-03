const menuItems = [
    { label: "Home", link: "index.html" },
    { label: "Log In", link: "login.html" },
    { label: "Sign Up", link: "signup.html" },
    { label: "Search", link: "search.html"},
]
var dropdown="<div></div>"

if(localStorage.getItem('user')!=null){
    var user = JSON.parse(localStorage.getItem('user'))
    console.log(localStorage.getItem('user'))
    console.log(user)
    menuItems.push({label: `Playlist`, link: "playlist.html"})
    var dropdown = `
        <div class="d-flex">
            <ul class="navbar-nav">
                <li class="nav-item dropdown">
                    <button class="btn dropdown-toggle" data-bs-toggle="dropdown">
                        Benvenuto ${user.name}
                    </button>
                    <ul class="dropdown-menu">
                        <li>
                            <a class="dropdown-item" href="#" onclick="logout()">Logout</a>
                        </li>
                
                    </ul>

                </li>
            </ul>
        </div>
        `;
}
var menuHTML = "";
for (let i = 0; i < menuItems.length; i++) {
    let item = menuItems[i];
    menuHTML += `<li class="nav-item"><a class="nav-link" href="${item.link}">${item.label}</a></li>`;
}
function logout(){
    localStorage.removeItem("user");
    window.location.href = "index.html"
}
const menuElement = document.getElementById('menu');
menuElement.innerHTML=`
    <nav class="navbar bg-primary">
    <div class="container-fluid">
    <a class="navbar-brand" href="index.html">
        <img src="iconPNG.png" alt="Logo" width="24" height="24" class="d-inline-block align-text-top">
        RhythmHub
    </a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
        <ul class="navbar-nav">
        ${menuHTML}
        </ul>
        ${dropdown}
    </div>
    </nav>
`;
