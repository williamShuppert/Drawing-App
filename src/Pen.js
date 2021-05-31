import Main from "./Main.js";
import Point from "./Point.js";
import World from "./World.js";
import Line from "./Line.js";

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
            this.currentLine.points.pop();
            this.lineJustStarted = false;
        }
       
        this.previousPoint = this.currentLine.points[this.currentLine.points.length - 1]
        var mousePos = new Point(event.x, event.y);
        var mouseWorldPos = Main.Camera.screenToWorld(mousePos);
        var chunkId = World.worldPointToChunkId(mouseWorldPos);
        if (this.previousPoint != null && this.previousPoint.sub(mouseWorldPos).evaluate((x,y) => (Math.abs(x) < .1 && Math.abs(y) < .1))) return; // TODO: change to screen points

        
        if (!this.currentChunk.id.equals(chunkId)) {
                      
            this.currentLine.points.push(mouseWorldPos)
            this.currentChunk.updateLastLine(this.currentLine);

            this.endLine();
            this.startNewLine(mouseWorldPos);

            this.currentLine.points[0] = this.previousPoint;
            this.lineJustStarted = false;
            this.currentChunk.updateLastLine(this.currentLine);
        } else {
            this.currentLine.points.push(mouseWorldPos)
            if (this.currentLine.points.length != 1)
                this.currentChunk.updateLastLine(this.currentLine);
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
        this.currentLine = new Line(worldPoint);
        this.currentLine.points.push(worldPoint);
        this.currentLine.points.push(worldPoint);
        this.currentChunk = Main.World.addObject(this.currentLine);
        this.currentChunk.updateLastLine(this.currentLine);
        console.log("Start line")
    }

    sendPoint() {

    }
}

export default Pen;