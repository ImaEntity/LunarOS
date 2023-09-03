(async function() {
    await windowManager_createWindow(
        "Task Manager",
        [width / 2 - 400, height / 2 - 250],
        [400, 600],
        function(updateType) {
            switch(updateType) {
                case "render": {
                    draw.textAlign = "center";
                    draw.fillStyle = "#ffffff";
                    draw.font = "15px Georgia";

                    const tasks = document.getElementsByTagName("script");

                    for(let i = 0; i < tasks.length; i++) {
                        const task = tasks[i];
                        const taskName = task.getAttribute("id") ?? task.getAttribute("src");

                        draw.fillText(taskName, 200, 20 + i * 20);
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