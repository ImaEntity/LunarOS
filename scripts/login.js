const password = "LunarOS";

let inputPassword = "";
let loggedIn = false;
let loginErr = null;
let controlDown = false;

// Angie, add a attempt limit on the passsword.
// And maybe add a login error message?
// You dipshit.

function login_start() {
    kernel_addFunctionPair(login_update, login_display);

    kernel_setBackground("backgrounds/loginDefault");
}

function login_stop() {
    kernel_removeFunctionPair(login_update, login_display);
}

function login_update() {
    if(loggedIn) {
        kernel_unloadScript("login");
        kernel_loadScript("desktop");
    }
}

function login_display() {
    draw.fillStyle = "#ffffff99";
    draw.strokeStyle = "#ffffff";
    draw.lineWidth = 2;

    kernel_setFontSize(40);
    draw.textAlign = "center";
    draw.fillText("LunarOS", width / 2, height / 2 - 120);

    kernel_setFontSize(30);
    draw.fillText("Login", width / 2, height / 2 + 60);

    draw.fillStyle = "#ffffff";
    draw.fillText(new Array(inputPassword.length + 1).join('•'), width / 2, height / 2 + 120);

    draw.fillStyle = "#ffffff66";
    draw.roundRect(width / 2 - 200, height / 2 + 90, 400, 40, 10);
    draw.fill();
    draw.stroke();

    draw.fillStyle = "#ffffff99";
    kernel_setFontSize(25);
    draw.textAlign = "left";
    draw.fillText(kernel_getVersion(), 10, height - 10);

    if(loginErr == null) return;

    draw.fillStyle = "#ffffff99";
    kernel_setFontSize(25);
    draw.textAlign = "center";
    draw.fillText(loginErr, width / 2, height / 2 + 160);
}

window.addEventListener("keydown", function(e) {
    const key = e.key;
    
    if(loggedIn) return;

    if(key == "Enter") {
        if(inputPassword == password) loggedIn = true;
        else if(inputPassword.length > 0) loginErr = "Incorrect password.";
        else loginErr = "Enter a password.";
    } else if(key == "Backspace") {
        if(controlDown) inputPassword = inputPassword.split(' ').slice(0, -1).join(' ');
        else inputPassword = inputPassword.slice(0, -1);
    } else if(key == "Control") {
        controlDown = true;
    } else if(key.length > 1) {
        return;
    } else {
        inputPassword += key;
        loginErr = null;
    }
});

window.addEventListener("keyup", function(e) {
    const key = e.key;

    if(loggedIn) return;

    if(key == "Control") {
        controlDown = false;
    }
});