const updateFunctions = [];
const displayFunctions = [];

const mouse = {x: 0, y: 0, left: false, middle: false, right: false, doubleClicked: false};

function kernel_openLink(link) {
    window.open(link, "_blank");
}

function kernel_getVersion() {
    return "1.0.0";
}

function kernel_broadcastFinish(id) {
    document.dispatchEvent(new CustomEvent("scriptFinished", {
        detail: {
            id
        }
    }));
}

function kernel_setBackground(img) {
    document.body.style.backgroundImage = `url(assets/${img}.png)`;
    document.body.style.backgroundSize = `${width}px ${height}px`;
    document.body.style.backgroundRepeat = "no-repeat";
}

function kernel_entryPoint() {
    draw.fillStyle = "#00ff00";
    draw.fillText("Kernel started.", 0, 40);

    window.addEventListener("contextmenu", function(e) {
        e.preventDefault();
    });

    window.addEventListener("mousemove", function(e) {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener("mousedown", function(e) {
        if(e.button == 0) mouse.left = true;
        else if(e.button == 1) mouse.middle = true;
        else if(e.button == 2) mouse.right = true;
    });

    window.addEventListener("dblclick", function(e) {
        mouse.doubleClicked = true;
    });

    window.addEventListener("mouseup", function(e) {
        if(e.button == 0) mouse.left = false;
        else if(e.button == 1) mouse.middle = false;
        else if(e.button == 2) mouse.right = false;
    });

    setInterval(function() {
        for(const func of updateFunctions) func();
        mouse.doubleClicked = false;
    }, 20);

    setInterval(function() {
        draw.clearRect(0, 0, width, height);
        
        for(const func of displayFunctions) func();
    });

    draw.fillStyle = "#00ff00";
    draw.fillText("Loading login screen...", 0, 50);

    kernel_loadScript("login");
}

function kernel_loadScript(name) {
    const script = document.createElement("script");

    script.src = `scripts/${name}.js`;
    script.id = name;
    
    script.addEventListener("load", function() {
        eval(`${name}_start();`);
    });

    document.body.appendChild(script);
}

function kernel_unloadScript(name) {
    const script = document.getElementById(name);

    eval(`${name}_stop();`);

    document.body.removeChild(script);
}

function kernel_loadAsset(name) {
    const img = new Image();
    img.src = `assets/${name}.png`;

    return img;
}

function kernel_addFunctionPair(update, display) {
    updateFunctions.push(update);
    displayFunctions.push(display);
}

function kernel_removeFunctionPair(update, display) {
    updateFunctions.splice(updateFunctions.indexOf(update), 1);
    displayFunctions.splice(displayFunctions.indexOf(display), 1);
}