const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let width = window.innerWidth;
let height = window.innerHeight;

let mouse = {x: 0, y: 0};

window.addEventListener("keydown", function(e) {
    onKeyDown(e.key, e.code);
});

window.addEventListener("mousemove", function(e) {
    mouse.x = e.offsetX;
    mouse.y = e.offsetY;
});

window.addEventListener("contextmenu", function(e) {
    e.preventDefault();
})

window.addEventListener("load", function() {
    width = window.innerWidth;
    height = window.innerHeight;

    canvas.width = width;
    canvas.height = height;

    setup();

    setInterval(update, 20);
    setInterval(function() {
        width = window.innerWidth;
        height = window.innerHeight;

        canvas.width = width;
        canvas.height = height;

        display();
    });
});