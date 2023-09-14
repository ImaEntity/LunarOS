(async function() {
    let inputExpr = "";
    let outputExpr = "";
    const ops = [
        [')', '^', '√', '%'],
        ['7', '8', '9', '/'],
        ['4', '5', '6', '*'],
        ['1', '2', '3', '-'],
        ['.', '0', '=', '+']
    ];

    await windowManager_createWindow(
        "Calculator",
        [width / 2 - 200, height / 2 - 300],
        [400, 600],
        async function(updateType, params) {
            switch(updateType) {
                case "update": {
                    break;
                }

                case "click": {
                    for(let y = 0; y < ops.length; y++) {
                        for(let x = 0; x < ops[0].length; x++) {
                            if(params.x < x * 100 || params.y < y * 100 + 100 || params.x > x * 100 + 100 || params.y > y * 100 + 200) continue;

                            const op = ops[y][x];
                            outputExpr = "";

                            if(op == '√') {
                                inputExpr += "√(";
                                break;
                            }

                            if(op != '=') {
                                inputExpr += op;
                                break;
                            }
                            
                            console.log(parseExpr(inputExpr))

                            try {
                                outputExpr = eval(parseExpr(inputExpr));

                                if(outputExpr == undefined || outputExpr == null) outputExpr = "";
                                if(outputExpr == Infinity) outputExpr = "Infinity";
                                if(outputExpr == -Infinity) outputExpr = "-Infinity";
                                if(isNaN(outputExpr)) outputExpr = "NaN";
                            } catch (e) {
                                outputExpr = "Syntax Error";
                            }

                            inputExpr = "";

                            break;
                        }
                    }

                    break;
                }

                case "render": {
                    draw.fillStyle = "#111111";
                    draw.strokeStyle = "#ffffff";
                    kernel_setFontSize(15);

                    draw.beginPath();
                    draw.roundRect(0, 0, 400, 600, 10);
                    draw.fill();

                    kernel_setFont("Sono");

                    for(let y = 0; y < ops.length; y++) {
                        for(let x = 0; x < ops[0].length; x++) {
                            draw.beginPath();

                            if((x + y) % 2 == 0) draw.fillStyle = "#222222";
                            else draw.fillStyle = "#cc3366";

                            draw.roundRect(x * 100, y * 100 + 100, 100, 100, 10);
                            draw.fill();

                            draw.fillStyle = "#ffffff";
                            draw.textAlign = "center";
                            draw.fillText(ops[y][x], x * 100 + 50, y * 100 + 157);
                        }
                    }
                    
                    const str = outputExpr == "" ? inputExpr : outputExpr;

                    draw.textAlign = "right";
                    kernel_setFontSize(25);
                    draw.fillText(str, 395, 50);

                    kernel_setFont("Nunito");

                    break;
                }

                default:
                    return "default";
            }
        }
    );

    kernel_broadcastFinish("calc");
}());

function parseExpr(expr) {
    let parsedExpr = "";
    let index = 0;

    while(index < expr.length) {
        const c = expr[index];

        if(c == '(') {
            let buf = "";
            index++;

            while (expr[index] != ')' && index < expr.length) {
                buf += expr[index];
                index++;
            }

            parsedExpr += '(';
            parsedExpr += parseExpr(buf);
            parsedExpr += ')';
            index++;
        } else if(c == '√') parsedExpr += "Math.sqrt";
        else if(c == '^') parsedExpr += "**";
        else if(c == 'π') parsedExpr += "Math.PI";
        else parsedExpr += c;

        index++;
    }

    return parsedExpr;
}