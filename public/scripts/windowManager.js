const windows = [{
    pos: [width / 2 - 400, height / 2 - 250],
    size: [800, 500],
    title: "Welcome!",
    created: false,
    onUpdate: function(updateType) {
        switch(updateType) {
            case "render": {
                draw.textAlign = "center";
                draw.fillStyle = "#ffffff";
                kernel_setFontSize(30);

                draw.fillText("Hello, world!", 400, 250);

                break;
            }

            default:
                return "default";
        }
    }
}];

let draggingWindow = null;
let mouseDown = false;
let mouseReleased = false;
let mouseDownPos = {x: mouse.x, y: mouse.y};

function windowManager_start() {
    kernel_addFunctionPair(windowManager_update, windowManager_display);
}

function windowManager_stop() {
    kernel_removeFunctionPair(windowManager_update, windowManager_display);
}

function moveToFront(index) {
    const win = windows[index];

    windows.splice(index, 1);
    windows.push(win);

    return windows.length - 1;
}

function windowManager_createWindow(title, pos, size, onUpdate) {
    return new Promise(function(resolve) {
        const win = {
            pos,
            size: [size[0], size[1] + 30],
            title,
            created: false,
            onUpdate: function(updateType, params) {
                switch(updateType) {
                    case "close": {
                        const resCode = onUpdate(updateType, params);

                        resolve();
                        return resCode ?? "default";
                    }
                    
                    default:
                        return onUpdate(updateType, params);
                }
            }
        };

        windows.push(win);
    });
}

function windowManager_createPopup(title, text, options) {
    return new Promise(function(resolve) {
        const popup = {
            pos: [width / 2 - 300, height / 2 - 100],
            size: [600, 200],
            title: title,
            created: false,
            onUpdate: function(updateType, params) {
                switch(updateType) {
                    case "create": {
                        options.buttons.reverse();
                        break;
                    }

                    case "click": {
                        for(let i = 0; i < options.buttons.length; i++) {
                            const button = options.buttons[i];
                        
                            if(params.x >= 545 - i * 50 && params.y >= 130 && params.x <= 590 - i * 50 && params.y <= 160) {
                                resolve(button);
                                return "close";
                            }
                        }

                        break;
                    }

                    case "render": {
                        draw.textAlign = "right";
                        draw.fillStyle = "#ffffff";
                        kernel_setFontSize(15);

                        draw.fillText(text, 575, 90);

                        const iconName = options.icon;
                        const icon = kernel_loadAsset(`popupIcons/${iconName}`);

                        draw.drawImage(icon, 25, 61, 48, 48);

                        for(let i = 0; i < options.buttons.length; i++) {
                            const button = options.buttons[i];

                            draw.textAlign = "center";
                            draw.fillStyle = "#ffffff";
                            draw.strokeStyle = "#ffffff";
                            kernel_setFontSize(15);

                            draw.strokeRect(545 - i * 50, 130, 45, 30);
                            draw.fillText(button, 567 - i * 50, 150);
                        }

                        break;
                    }

                    case "close": {
                        resolve(null);
                        return "default";
                    }

                    default:
                        return "default";
                }
            }
        };

        windows.push(popup);
    });
}

async function windowManager_update() {
    if(mouseDown && !mouse.left) mouseReleased = true;
    if(!mouseDown && mouse.left) mouseDownPos = {x: mouse.x, y: mouse.y};

    if(draggingWindow != null) {
        const win = windows[draggingWindow.index];

        if(!win) return;

        win.pos[0] = mouse.x - draggingWindow.offsetX;
        win.pos[1] = mouse.y - draggingWindow.offsetY;
    }

    for(let i = windows.length - 1; i >= 0; i--) {
        const win = windows[i];
        const {pos, size, onUpdate} = win;

        if(!win.created) {
            const resCode = await onUpdate("create");
            if(resCode == "close") {
                windows.splice(i, 1);
                continue;
            }

            win.created = true;
        }

        const resCode = await win.onUpdate("update");
        if(resCode == "close") {
            windows.splice(i, 1);
            continue;
        }

        if(mouse.x >= pos[0] + size[0] - 30 && mouse.x <= pos[0] + size[0] && mouse.y >= pos[1] && mouse.y <= pos[1] + 30) {
            if(!mouseReleased && mouse.left) break;
            else if(!mouseReleased) break;

            if(Math.sqrt((mouse.x - mouseDownPos.x) ** 2 + (mouse.y - mouseDownPos.y) ** 2) > 45) break;

            if(draggingWindow != null) continue;

            const resCode = await onUpdate("close");

            if(resCode == "default") windows.splice(i, 1);
            continue;
        }

        if(mouse.x >= pos[0] && mouse.x <= pos[0] + size[0] && mouse.y >= pos[1] + 30 && mouse.y <= pos[1] + size[1] && i == windows.length - 1) {
            if(!mouseReleased && mouse.left) break;
            else if(!mouseReleased) break;

            const resCode = await onUpdate("click", {x: mouse.x - pos[0], y: mouse.y - pos[1] - 30});

            if(resCode == "close") {
                windows.splice(i, 1);
                continue;
            }
        }

        if(mouse.x >= pos[0] && mouse.x <= pos[0] + size[0] - 30 && mouse.y >= pos[1] && mouse.y <= pos[1] + 30 && mouse.left && !mouseDown) {
            if(draggingWindow != null) continue;

            const newIndex = moveToFront(i);

            draggingWindow = {
                index: newIndex,
                offsetX: mouse.x - pos[0],
                offsetY: mouse.y - pos[1]
            };

            break;
        }
    }
    
    if(!mouse.left) draggingWindow = null;

    mouseDown = mouse.left;
    if(mouseReleased) mouseReleased = false;
}

async function windowManager_display() {
    for(let i = 0; i < windows.length; i++) {
        const win = windows[i];
        const {pos, size, title} = win;

        draw.fillStyle = "#000000";
        draw.strokeStyle = "#ffffff99";
        draw.lineWidth = 2;
        
        draw.beginPath();
        draw.roundRect(pos[0], pos[1], size[0], size[1], 10);
        draw.stroke();
        draw.fill();

        draw.fillStyle = "#222222";

        draw.beginPath();
        draw.roundRect(pos[0], pos[1], size[0], 30, 10);
        draw.fill();

        draw.fillStyle = "#cc0000";

        draw.beginPath();
        draw.roundRect(pos[0] + size[0] - 30, pos[1], 30, 30, 10);
        draw.fill();

        draw.save();

        draw.translate(pos[0] + size[0] - 15, pos[1] + 15);
        draw.rotate(-Math.PI / 4);

        draw.beginPath();

        draw.fillStyle = "#222222";
        draw.roundRect(-10, -2.5, 20, 5, 10);

        draw.fill();

        draw.rotate(Math.PI / 2);

        draw.beginPath();

        draw.fillStyle = "#222222";
        draw.roundRect(-10, -2.5, 20, 5, 10);

        draw.fill();

        draw.restore();
        
        draw.fillStyle = "#cccccc";
        kernel_setFontSize(20);
        draw.textAlign = "left";

        draw.fillText(title, pos[0] + 5, pos[1] + 20);

        draw.save();

        draw.translate(pos[0], pos[1] + 30);
        await win.onUpdate("render");

        draw.restore();
    }  
}

window.addEventListener("keydown", async function(e) {
    const win = windows[windows.length - 1];

    const resCode = await win.onUpdate("keydown", {key: e.key, code: e.code});
    if(resCode == "close") windows.pop();
});

window.addEventListener("keyup", async function(e) {
    const win = windows[windows.length - 1];

    const resCode = await win.onUpdate("keyup", {key: e.key, code: e.code});
    if(resCode == "close") windows.pop();
});

window.addEventListener("keypress", async function(e) {
    const win = windows[windows.length - 1];

    const resCode = await win.onUpdate("keypress", {key: e.key, code: e.code});
    if(resCode == "close") windows.pop();
});