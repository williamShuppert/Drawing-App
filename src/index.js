import Main from "./Main.js";
import Point from "./Point.js";
import World from "./World.js";

var drag = false;
var mouseDown = null;
var lastCameraPos = null;

// TODO
/*
Resizing canvas on window resize
Work on Menu
Implement Objects instead of lines
Fix line width when zooming
Fix boarder drawing issue
World should only render and update visible chunks
Tools such as pen, eraser, drag, ect...
Undo
Saving and opening from file
*/

var main = new Main();
main.gameLoop();

window.onkeydown = (event) => {
    if (event.key == "a") Main.Camera.position.x-=.10
    if (event.key == "d") Main.Camera.position.x+=.10
    if (event.key == "w") Main.Camera.position.y-=.10
    if (event.key == "s") Main.Camera.position.y+=.10
    if (event.key == "2") Main.Camera.zoom -= .05;
    if (event.key == "1") Main.Camera.zoom += .05;
    if (event.key == "1" || event.key == "2") {
        Main.World.renderUpdate();
        Main.World.render();
    }
    if (event.key == " ") drag = true;
}

window.onkeyup = event => {
    if (event.key == " ") drag = false;
}

window.onmousedown = (event) => {
    console.clear();
    var mouseWorldPoint = Main.Camera.screenToWorld(new Point(event.x, event.y));
    console.log("Mouse at position: " + mouseWorldPoint);
    console.log("In chunk: " + World.worldPointToChunkId(mouseWorldPoint));
    Main.Pen.onMouseDown(event);
    mouseDown = new Point(event.x, event.y);
    lastCameraPos = Main.Camera.position;
}

window.onmouseup = (event) => {
    Main.Pen.onMouseUp(event);
    mouseDown = null;
}

window.onmousemove = (event) => {
    if (drag && mouseDown != null) {
        var mouseWorldPoint = new Point(event.x, event.y);
        Main.Camera.position = lastCameraPos.add(Main.Camera.screenToWorld(mouseDown).sub(Main.Camera.screenToWorld(mouseWorldPoint)));
    } else {
        Main.Pen.onMouseMove(event);
    }
}