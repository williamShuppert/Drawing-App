import Chunk from "./Chunk.js";
import Point from "./Point.js";
import World from "./World.js";
import Camera from "./Camera.js";

class Pen {

    constructor(camera, world) {
        this.camera = camera;
        this.world = world;

        this.canDraw = false;
        this.currentLine = null;
        this.currentChunk = null;
    }

    onMouseDown(event) {
        this.startNewLine(this.camera.screenToWorld(new Point(event.x, event.y)));
        this.canDraw = true;
    }

    onMouseMove(event) {
        if (!this.canDraw) return;

        var previousPoint = this.currentChunk.lines[this.currentChunk.lines.length - 1][this.currentChunk.lines[this.currentChunk.lines.length - 1].length-1];
        var mousePos = new Point(event.x, event.y);
        var mouseWorldPos = this.camera.screenToWorld(mousePos);
        var chunkId = this.world.pointToChunkId(mouseWorldPos);
        if (previousPoint != null && previousPoint.sub(mouseWorldPos).evaluate((x,y) => (Math.abs(x) < .1 && Math.abs(y) < .1))) return;

        
        if (!this.currentChunk.id.equals(chunkId)) {            
            this.currentLine.push(mouseWorldPos)
            this.currentChunk.updateLastLine(this.camera);

            this.endLine();
            this.startNewLine(mouseWorldPos);

            this.currentLine.push(previousPoint)
        } else {
            this.currentLine.push(mouseWorldPos)
            this.currentChunk.updateLastLine(this.camera);
        }
    }

    onMouseUp(event) {
        this.endLine();
    }

    endLine() {
        this.currentChunk = null;
        this.currentLine = null;
        this.canDraw = false;
        console.log("End line")
    }

    startNewLine(worldPoint) {
        this.canDraw = true;
        this.currentLine = new Array();
        this.currentChunk = this.world.addObject(this.currentLine, this.world.pointToChunkId(worldPoint));
        console.log("Start line")
    }

    sendPoint() {

    }
}

export default Pen;