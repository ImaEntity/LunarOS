// Hey Angie, could you finish this?
// Use eval with js to do commands.

(async function() {
    const lines = ["C:\\>"];
    let cmd = "";

    await windowManager_createWindow(
        "Terminal",
        [width / 2 - 450, height / 2 - 300],
        [900, 600],
        async function(updateType, params) {
            switch(updateType) {
                case "render": {
                    draw.fillStyle = "#ffffff";
                    draw.strokeStyle = "#ffffff";

                    kernel_setFontSize(15);

                    for(let i = 0; i < lines.length; i++) {
                        if(i == lines.length - 1) draw.fillText(lines[i] + cmd, 5, 20 + i * 15);
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
                        cmd = "";
                    } else if(params.key == "Backspace") {
                        cmd = cmd.slice(0, -1);
                    } else if(params.key.length > 1) {
                        return;
                    } else {
                        cmd += params.key;
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