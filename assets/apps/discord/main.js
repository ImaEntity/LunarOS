(async function() {
    const res = await windowManager_createPopup("Leaving OS!", "This program opens a new tab, are you sure you want to run it?", {
        buttons: ["Yes", "No"],
        icon: "warning"
    });

    if(res != "Yes") {
        kernel_broadcastFinish("discord");
        return;
    }

    kernel_openLink("https://discord.gg/JjYJr8sanu");
    kernel_broadcastFinish("discord");
}());