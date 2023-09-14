const icons = [
    {
        name: "Discord",
        scriptPath: "apps/discord/main",
        icon: "apps/discord/icon",
        pos: {
            x: 8,
            y: 8
        }
    },
    {
        name: "Task Manager",
        scriptPath: "apps/taskmgr/main",
        icon: "apps/taskmgr/icon",
        pos: {
            x: 104,
            y: 8
        }
    },
    {
        name: "Terminal",
        scriptPath: "apps/terminal/main",
        icon: "apps/terminal/icon",
        pos: {
            x: 200,
            y: 8
        }
    },
    {
        name: "{DEBUG_APP}",
        scriptPath: "apps/calc/main",
        icon: "popupIcons/error",
        pos: {
            x: 296,
            y: 8
        }
    }
];

function desktop_start() {
    kernel_addFunctionPair(desktop_update, desktop_display);

    kernel_setBackground("backgrounds/default");
    kernel_loadScript("windowManager");
}

function desktop_stop() {
    kernel_removeFunctionPair(desktop_update, desktop_display);
}

function desktop_update() {
    for(let i = 0; i < icons.length; i++) {
        const icon = icons[i];

        if(mouse.x > icon.pos.x + 8 && mouse.x < icon.pos.x + 56 && mouse.y > icon.pos.y + 8 && mouse.y < icon.pos.y + 56 && mouse.doubleClicked) {
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
    for(let i = 0; i < icons.length; i++) {
        const icon = icons[i];

        draw.drawImage(kernel_loadAsset(icon.icon), icon.pos.x, icon.pos.y, 48, 48);

        draw.textAlign = "center";
        draw.fillStyle = "#ffffff";
        kernel_setFontSize(15);

        draw.fillText(icon.name, icon.pos.x + 24, icon.pos.y + 64);
    }

    if(!mouseDown) return;

    draw.lineWidth = 2;
    draw.fillStyle = "#00cc9966";
    draw.strokeStyle = "#00cc99";

    draw.beginPath();
    draw.roundRect(mouseDownPos.x, mouseDownPos.y, mouse.x - mouseDownPos.x, mouse.y - mouseDownPos.y, 5);
    draw.stroke();
    draw.fill();
}