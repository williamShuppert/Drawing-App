import Camera from "./Camera.js";
import World from "./World.js";
import Point from "./Point.js";
import Pen from "./Pen.js";

class Main {
    constructor() {
        Main.CTX.canvas.width  = window.innerWidth;
        Main.CTX.canvas.height = window.innerHeight;
        Main.CTX.translate(0.5, 0.5);

        this.gameLoop = this.gameLoop.bind(this);
    }

    gameLoop() {

        Main.CTX.clearRect(-.5,-.5, Main.CTX.canvas.width, Main.CTX.canvas.height);
        
        Main.Camera.render(Main.CTX);
        Main.World.render(Main.CTX, Main.Camera);
        
        requestAnimationFrame(this.gameLoop);
    }
    
}

Main.Canvas = document.getElementById("canvas");
Main.CTX = Main.Canvas.getContext("2d");
Main.Camera = new Camera(new Point(window.innerWidth, window.innerHeight));
Main.World = new World(Main.camera);
Main.Pen = new Pen(Main.Camera, Main.World);

export default Main;