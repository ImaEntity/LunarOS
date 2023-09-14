(async function() {
    const lines = ["C:\\>"];
    const cmdHistory = [];
    let historyIndex = 0;  
    let cmd = "";
    let controlDown = false;
    let tick = 0;
    let cursor = "";

    await windowManager_createWindow(
        "Terminal",
        [width / 2 - 450, height / 2 - 300],
        [900, 600],
        async function(updateType, params) {
            switch(updateType) {
                case "update": {
                    while(lines.length > 560 / 15) lines.splice(0, 1);

                    if(tick % 20 == 0) cursor = !cursor ? '|' : "";
                    tick++;

                    break;
                }

                case "render": {
                    draw.fillStyle = "#ffffff";
                    draw.strokeStyle = "#ffffff";

                    kernel_setFontSize(15);

                    for(let i = 0; i < lines.length; i++) {
                        if(i == lines.length - 1) draw.fillText(lines[i] + cmd + cursor, 5, 20 + i * 15);
                        else draw.fillText(lines[i], 5, 20 + i * 15);
                    }

                    break;
                }

                case "keydown": {
                    if(params.key == "Enter") {
                        lines[lines.length - 1] += cmd;
                        
                        let outStr = "";

                        try {
                            outStr = eval(cmd);

                            if(outStr == undefined) outStr = "undefined";
                            if(outStr == null) outStr = "null";

                            outStr = outStr.toString();
                        } catch(e) {
                            outStr = e.toString();
                        }

                        lines.push(...outStr.split('\n'));

                        lines.push("", "C:\\>");
                        cmdHistory.push(cmd);
                        historyIndex = cmdHistory.length - 1;
                        cmd = "";
                    } else if(params.key == "Control") {
                        controlDown = true;
                    } else if(params.key == "Backspace") {
                        if(controlDown) cmd = cmd.split(' ').slice(0, -1).join(' ');
                        else cmd = cmd.slice(0, -1);
                    } else if(params.key == "ArrowUp") {
                        cmd = cmdHistory[historyIndex] ?? "";
                        historyIndex = historyIndex <= 0 ? 0 : historyIndex - 1;
                    } else if(params.key == "ArrowDown") {
                        cmd = cmdHistory[historyIndex] ?? "";
                        historyIndex = historyIndex >= cmdHistory.length - 1 ? cmdHistory.length - 1 : historyIndex + 1;
                    } else if(params.key.length > 1) {
                        return;
                    } else {
                        cmd += params.key;
                    }

                    break;
                }

                case "keyup": {
                    if(params.key == "Control") {
                        controlDown = false;
                    }
                    
                    break;
                }

                default:
                    return "default";
            }
        }
    );

    kernel_broadcastFinish("terminal");
}());