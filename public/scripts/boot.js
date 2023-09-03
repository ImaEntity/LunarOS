const kernel = document.createElement("script");
const width = window.innerWidth;
const height = window.innerHeight;

let draw = document.getElementById("canvas");

draw.width = width;
draw.height = height;

draw = draw.getContext("2d");

draw.fillStyle = "#000000";
draw.fillRect(0, 0, width, height);

draw.fillStyle = "#00ff00";
draw.fillText("Booting...", 0, 10);

kernel.src = "scripts/kernel.js";
kernel.id = "kernel";

kernel.addEventListener("load", function() {
    draw.fillText("Loaded kernel.", 0, 20);
    draw.fillText("Starting kernel...", 0, 30);

    kernel_entryPoint();
});

document.body.appendChild(kernel);