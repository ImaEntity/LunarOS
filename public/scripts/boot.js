const kernel = document.createElement("script");
const canvas = document.getElementById("canvas");
const draw = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;

canvas.width = width;
canvas.height = height;

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