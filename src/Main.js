import Camera from "./Camera.js";
import World from "./World.js";
import Point from "./Point.js";
import Pen from "./Pen.js";

class Main {
    constructor() {
        Main.CTX.canvas.width  = window.innerWidth;
        Main.CTX.canvas.height = window.innerHeight;
        Main.CTX.translate(0.5, 0.5);

        this.renderGrid = true;
        this.renderChunkBoarders = true;

        this.lastFrame = Date.now()
        this.deltaTime = 0
        this.frameCount = 0
        this.fpsTime = 0
        this.fpsElement = document.getElementById("fps-value");
        
        this.currentPositionElement = document.getElementById("current-position-value");

        this.gameLoop = this.gameLoop.bind(this);
    }

    gameLoop() {
        
        Main.CTX.clearRect(-.5,-.5, Main.CTX.canvas.width, Main.CTX.canvas.height);
        
        Main.World.render(Main.CTX, Main.Camera, this.renderChunkBoarders);
        if (this.renderGrid) Main.Camera.render(Main.CTX);
        
        this.deltaTime = (Date.now() - this.lastFrame) / 1000
        this.lastFrame = Date.now()

        this.fpsTime += this.deltaTime
        this.frameCount++
        if (this.fpsTime >= 1) {
            //console.clear()
            //console.log("FPS:", this.frameCount)
            this.fpsElement.innerHTML = this.frameCount;
            
            this.currentPositionElement.innerHTML = Main.Camera.position.round(2);

            this.frameCount = 0
            this.fpsTime = 0
        }

        requestAnimationFrame(this.gameLoop);
    }
    
    toggleGrid() {
        this.renderGrid = !this.renderGrid;
    }
    toggleChunkBoarders() {
        this.renderChunkBoarders = !this.renderChunkBoarders;
    }
}

Main.Canvas = document.getElementById("canvas");
Main.CTX = Main.Canvas.getContext("2d");
Main.Camera = new Camera(new Point(window.innerWidth, window.innerHeight));
Main.World = new World(Main.camera);
Main.Pen = new Pen(Main.Camera, Main.World);

export default Main;