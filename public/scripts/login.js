const password = "LunarOS";
const maxPassAttempts = 10;

let inputPassword = "";
let loggedIn = false;
let loginErr = null;
let controlDown = false;
let passAttemptCount = 0;

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

    draw.fillStyle = "#ffffff99";
    kernel_setFontSize(25);
    draw.textAlign = "left";
    draw.fillText(kernel_getVersion(), 10, height - 10);

    if(passAttemptCount >= maxPassAttempts) {
        draw.fillStyle = "#ffffff99";
        kernel_setFontSize(25);
        draw.textAlign = "center";

        draw.fillText("Too many attempts, please restart to try again.", width / 2, height / 2 + 120);
        return;
    }

    draw.textAlign = "center";
    kernel_setFontSize(30);
    draw.fillStyle = "#ffffff";
    draw.fillText(new Array(inputPassword.length + 1).join('•'), width / 2, height / 2 + 120);

    draw.fillStyle = "#ffffff66";
    draw.roundRect(width / 2 - 200, height / 2 + 90, 400, 40, 10);
    draw.fill();
    draw.stroke();

    if(passAttemptCount > 6) {
        draw.fillStyle = "#ffffff99";
        kernel_setFontSize(25);
        draw.textAlign = "center";

        draw.fillText(`Attempts left: ${maxPassAttempts - passAttemptCount}`, width / 2, height / 2 + 190);
    }

    if(loginErr == null) return;

    draw.fillStyle = "#ffffff99";
    kernel_setFontSize(25);
    draw.textAlign = "center";
    draw.fillText(loginErr, width / 2, height / 2 + 160);
}

window.addEventListener("keydown", function(e) {
    const key = e.key;
    
    if(loggedIn || passAttemptCount >= maxPassAttempts) return;

    if(key == "Enter") {
        if(inputPassword == password) loggedIn = true;
        else if(inputPassword.length > 0) loginErr = "Incorrect password.";
        else loginErr = "Enter a password.";

        passAttemptCount += inputPassword.length > 0 ? 1 : 0;
        inputPassword = "";
    } else if(key == "Backspace") {
        if(controlDown) inputPassword = inputPassword.split(' ').slice(0, -1).join(' ');
        else inputPassword = inputPassword.slice(0, -1);

        loginErr = null;
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