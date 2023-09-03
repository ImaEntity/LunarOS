const icons = [
    {
        name: "Discord",
        scriptPath: "apps/discord/main",
        icon: "apps/discord/icon"
    },
    {
        name: "Task Manager",
        scriptPath: "apps/taskmgr/main",
        icon: "apps/discord/icon"
    }
];

function desktop_start() {
    kernel_addFunctionPair(desktop_update, desktop_display);
    kernel_loadScript("windowManager");
}

function desktop_stop() {
    kernel_removeFunctionPair(desktop_update, desktop_display);
}

function desktop_update() {
    for(let i = 0; i < icons.length; i++) {
        const icon = icons[i];

        if(mouse.x > i * 96 + 8 && mouse.x < i * 96 + 56 && mouse.y > 8 && mouse.y < 56 && mouse.doubleClicked) {
            const script = document.createElement("script");
            
            script.id = icon.scriptPath.split('/')[1];
            script.src = `assets/${icon.scriptPath}.js`;

            document.addEventListener("scriptFinished", function(e) {
                if(e.detail.id != script.id) return;
                
                script.remove();
                document.removeEventListener("scriptFinished", arguments.callee);
            });

            document.body.appendChild(script);
        }
    }
}


function desktop_display() {
    const desktopBG = kernel_loadAsset("backgrounds/default");

    draw.drawImage(desktopBG, 0, 0, width, height);

    for(let i = 0; i < icons.length; i++) {
        const icon = icons[i];

        draw.drawImage(kernel_loadAsset(icon.icon), i * 96 + 8, 8, 48, 48);

        draw.textAlign = "center";
        draw.fillStyle = "#ffffff";
        draw.font = "15px Georgia";

        draw.fillText(icon.name, i * 96 + 32, 72);
    }
}