(async function() {
    await windowManager_createWindow(
        "Task Manager",
        [width / 2 - 200, height / 2 - 300],
        [400, 600],
        async function(updateType, params) {
            switch(updateType) {
                case "render": {
                    draw.fillStyle = "#ffffff";
                    draw.strokeStyle = "#ffffff";
                    kernel_setFontSize(15);

                    const tasks = document.getElementsByTagName("script");

                    for(let i = 0; i < tasks.length; i++) {
                        const task = tasks[i];
                        const taskName = task.getAttribute("id") ?? task.getAttribute("src");

                        draw.textAlign = "left";
                        draw.fillText(taskName, 5, 20 + i * 20);

                        draw.textAlign = "right";
                        draw.fillText("End Task", 395, 20 + i * 20);

                        draw.strokeRect(330, 5 + i * 20, 70, 20);
                    }

                    break;
                }

                case "click": {
                    const tasks = document.getElementsByTagName("script");

                    console.log("click");

                    for(let i = 0; i < tasks.length; i++) {
                        if(params.x < 330 || params.x > 400 || params.y < 5 + i * 20 || params.y > 5 + i * 20 + 20) continue;

                        const task = tasks[i];
                        const taskName = task.getAttribute("id");

                        if(taskName == null) {
                            await windowManager_createPopup("Cannot End Task", "This task cannot be ended.", {
                                buttons: ["OK"],
                                icon: "error"
                            });

                            continue;
                        }
                        
                        document.getElementById(taskName).remove();
                    }

                    break;
                }

                default:
                    return "default";
            }
        }
    );

    kernel_broadcastFinish("taskmgr");
}());