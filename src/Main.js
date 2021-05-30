import Camera from "./Camera.js";
import World from "./World.js";
import Point from "./Point.js";

class Main {
    constructor() {
        
    }
}

Main.camera = new Camera(new Point(window.innerWidth, window.innerHeight));
Main.World = new World(Main.camera);

export default Main;