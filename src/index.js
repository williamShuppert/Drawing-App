import Main from "./Main.js";
import Point from "./Point.js";
import Camera from "./Camera.js";
import World from "./World.js";
import Pen from "./Pen.js";

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.canvas.width  = window.innerWidth;
ctx.canvas.height = window.innerHeight;
ctx.translate(0.5, 0.5);

var c = Main.camera;
var w = Main.World;
var pen = new Pen(c, w);

function gameLoop() {

    ctx.clearRect(-.5,-.5, ctx.canvas.width, ctx.canvas.height);
    
    c.render(ctx);
    w.render(ctx, c);
    
    requestAnimationFrame(gameLoop);
}
requestAnimationFrame(gameLoop);

window.onkeydown = (event) => {
    if (event.key == "a") c.position.x-=.10
    if (event.key == "d") c.position.x+=.10
    if (event.key == "w") c.position.y-=.10
    if (event.key == "s") c.position.y+=.10
    if (event.key == "2") c.zoom -= .05;
    if (event.key == "1") c.zoom += .05;
}

window.onmousedown = (event) => {
    console.clear();
    var mouseWorldPoint = c.screenToWorld(new Point(event.x, event.y));
    console.log("Mouse at position: " + mouseWorldPoint.toString());
    console.log("In chunk: " + w.pointToChunkId(mouseWorldPoint).toString());
    pen.onMouseDown(event);
}

window.onmouseup = (event) => {
    pen.onMouseUp(event);
}

window.onmousemove = (event) => {
    pen.onMouseMove(event);
}