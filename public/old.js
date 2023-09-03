const password = "";
const assets = {
    defaultBG: document.createElement("img"),
    defaultLoginBG: document.createElement("img"),
    discordLogo: document.createElement("img")
};

let loginY = 0;
let loginFrameTick = 0;
let loggedIn = false;
let inputPassword = "";

let taskbarApps = [
    {
        name: "Discord",
        icon: assets.discordLogo,
        onClick: function() {
            createPopup("Discord", "This will open a new tab, are you sure you want to continue?", "button:yes/no,icon:warning", function(res) {
                if(res == "yes") window.open("https://discord.gg/mNUk6vfFHG");
            });
        }
    }
];

let windows = [{
    title: "Notepad",
    pos: [100, 100],
    size: [800, 500]
}];

function setup() {
    assets.defaultBG.src = "assets/backgrounds/default.png";
    assets.defaultLoginBG.src = "assets/login/backgrounds/default.png";
    assets.discordLogo.src = "assets/externals/discord.png";
}

function updateDesktop() {
    for(let i = 0; i < taskbarApps.length; i++) {
        if(mouse.x > 75 + i * 100 &&
            mouse.x < 75 + i * 100 + 50 && 
            mouse.y > height - 130 + loginY + height &&
            mouse.y < height - 130 + loginY + height + 50) {
            taskbarApps[i].onClick();
        }
    }
}

function update() {
    if(loggedIn && loginY > -height) {
        loginY -= loginFrameTick;
        loginFrameTick++;
    } else if(loggedIn) {
        loginY = -height;
    }

    if(loggedIn) updateDesktop();
}

function displayLoginScreen() {
    ctx.fillStyle = "#ffffff99";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;

    ctx.drawImage(assets.defaultLoginBG, 0, loginY, width, height);

    ctx.font = "40px Georgia";
    ctx.textAlign = "center";
    ctx.fillText("LunarOS", width / 2, height / 2 - 120 + loginY);

    ctx.font = "30px Georgia";
    ctx.fillText("Login", width / 2, height / 2 + 60 + loginY);

    ctx.fillStyle = "#ffffff";
    ctx.fillText(new Array(inputPassword.length + 1).join('•'), width / 2, height / 2 + 120 + loginY);

    ctx.fillStyle = "#ffffff66";
    ctx.roundRect(width / 2 - 200, height / 2 + 90 + loginY, 400, 40, 10);
    ctx.fill();
    ctx.stroke();
}

function displayDesktop() {
    ctx.fillStyle = "#ffffff66";
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 2;
    ctx.textAlign = "center";
    ctx.font = "20px Georgia";

    ctx.drawImage(assets.defaultBG, 0, loginY + height, width, height);

    ctx.roundRect(50, height - 135 + loginY + height, width - 100, 85, 10);
    ctx.fill();
    ctx.stroke();


    for(let i = 0; i < taskbarApps.length; i++) {
        ctx.drawImage(taskbarApps[i].icon, 75 + i * 100, height - 130 + loginY + height, 50, 50);
        ctx.fillText(taskbarApps[i].name, 100 + i * 100, height - 60 + loginY + height);
    }

    // Display all the windows on the desktop
    for(let i = 0; i < windows.length; i++) {
        
    }
}

function display() {
    ctx.clearRect(0, 0, width, height);
    
    if(loginY > -height) displayLoginScreen();
    if(loginFrameTick > 0) displayDesktop();
}

function onKeyDown(key, code) {
    if(!loggedIn) {
        if(key == "Enter") {
            if(inputPassword == password) loggedIn = true;
        } else if(key == "Backspace") {
            inputPassword = inputPassword.slice(0, -1);
        } else if(key == "Shift" || key == "Control" || key == "Meta") {
            return;
        } else {
            inputPassword += key;
        }
    }
}