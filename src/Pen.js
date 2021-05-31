import Main from "./Main.js";
import Point from "./Point.js";
import World from "./World.js";

class Pen {

    constructor(camera, world) {
        this.camera = camera;
        this.world = world;

        this.canDraw = false;
        this.lineJustStarted = false;
        this.previousPoint;
        this.currentLine = null;
        this.currentChunk = null;
    }

    onMouseDown(event) {
        this.startNewLine(Main.Camera.screenToWorld(new Point(event.x, event.y)));
        this.canDraw = true;
    }

    onMouseMove(event) {
        if (!this.canDraw) return;
        if (this.lineJustStarted) {
            this.currentLine.pop();
            this.lineJustStarted = false;
        }
       
        this.previousPoint = this.currentLine[this.currentLine.length - 1]
        var mousePos = new Point(event.x, event.y);
        var mouseWorldPos = Main.Camera.screenToWorld(mousePos);
        var chunkId = World.worldPointToChunkId(mouseWorldPos);
        if (this.previousPoint != null && this.previousPoint.sub(mouseWorldPos).evaluate((x,y) => (Math.abs(x) < .1 && Math.abs(y) < .1))) return; // TODO: change to screen points

        
        if (!this.currentChunk.id.equals(chunkId)) {
                      
            this.currentLine.push(mouseWorldPos)
            this.currentChunk.updateLastLine(Main.Camera);

            this.endLine();
            this.startNewLine(mouseWorldPos);

            this.currentLine[0] = this.previousPoint;
            this.lineJustStarted = false;
            this.currentChunk.updateLastLine(Main.Camera);
        } else {
            this.currentLine.push(mouseWorldPos)
            if (this.currentLine.length != 1)
                this.currentChunk.updateLastLine(Main.Camera);
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
        this.lineJustStarted = true;
        this.canDraw = true;
        this.currentLine = new Array();
        this.currentLine.push(worldPoint);
        this.currentLine.push(worldPoint);
        this.currentChunk = Main.World.addObject(this.currentLine, World.worldPointToChunkId(worldPoint));
        this.currentChunk.updateLastLine(Main.Camera);
        console.log("Start line")
    }

    sendPoint() {

    }
}

export default Pen;