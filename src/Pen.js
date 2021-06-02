import Main from "./Main.js";
import Point from "./Point.js";
import World from "./World.js";
import Line from "./Line.js";

class Pen {

    constructor(camera, world) {
        this.camera = camera;
        this.world = world;

        this.width = 5;
        this.style = "rgb(0,0,0)";
        this.snapToGrid = true;
        this.snapSafeArea = .4;

        this.canDraw = false;
        this.lineJustStarted = false;
        this.previousPoint;
        this.currentLine = null;
        this.currentChunk = null;
    }

    onMouseDown(event) {
        this.style = "rgb("+Math.floor(Math.random() * 255)+","+Math.floor(Math.random() * 255)+","+Math.floor(Math.random() * 255)+")";
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

        if (this.snapToGrid) {
            mouseWorldPos = this.snapPoint(mouseWorldPos);
            if (mouseWorldPos == null) return;
            if (this.previousPoint.equals(mouseWorldPos)) return;
            // look at the slope if it's the same delete the last point
        }

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
        this.currentLine = new Line(worldPoint, this.width, this.style);
        if (this.snapToGrid) worldPoint = worldPoint.round();
        this.currentLine.points.push(worldPoint);
        this.currentLine.points.push(worldPoint);
        this.currentChunk = Main.World.addObject(this.currentLine);
        this.currentChunk.updateLastLine(this.currentLine);
        console.log("Start line")
    }

    snapPoint(worldPoint) {
        var center = worldPoint.floor().add(new Point(.5));
        if (center.distance(worldPoint) < this.snapSafeArea) return null;
        return worldPoint.round();
    }
}

export default Pen;