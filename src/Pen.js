import Main from "./Main.js";
import Point from "./Point.js";
import World from "./World.js";
import Line from "./Line.js";

class Pen {

    constructor(camera, world) {
        this.camera = camera;
        this.world = world;

        this.width = 100;
        this.style = "rgb(0,0,0)";
        this.snapToGrid = false;
        this.snapSafeArea = .4;

        this.canDraw = false;
        this.lineJustStarted = false;
        this.previousPoint;
        this.currentLine = null;
        this.currentChunk = null;

        // vars for seamless chunk transition when drawing
        this.currentLeftOrRightChunk = null;
        this.currentLeftOrRightLine = null;
        this.currentTopOrBottomChunk = null;
        this.currentTopOrBottomLine = null;
        // make smooth corner transitions
        // split up left and right and bottom and top
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

        
        if (!this.currentChunk.id.equals(chunkId)) { // create new line when entering new chunk
               
            // for seamless chunk transition
            if (this.currentChunk.id.equals(chunkId.add(new Point(1,0))) || this.currentChunk.id.equals(chunkId.sub(new Point(1,0)))) {
                this.currentLine = this.currentLeftOrRightLine;
                this.currentChunk = this.currentLeftOrRightChunk;
                console.log("smooth switch")
            } else if (this.currentChunk.id.equals(chunkId.add(new Point(0,1))) || this.currentChunk.id.equals(chunkId.sub(new Point(0,1)))) {
                this.currentLine = this.currentTopOrBottomLine;
                this.currentChunk = this.currentTopOrBottomChunk;
                console.log("smooth switch")
            }

            this.currentLeftOrRightLine = null;
            this.currentLeftOrRightChunk = null;
            this.currentTopOrBottomLine = null;
            this.currentTopOrBottomChunk = null;

            if (this.currentChunk == null) this.startNewLine(mouseWorldPos);
            this.currentChunk.updateLastLine(this.currentLine);


        } else { // update line
            this.currentLine.points.push(mouseWorldPos)
            if (this.currentLine.points.length != 1)
                this.currentChunk.updateLastLine(this.currentLine);

            this.seamlessChunkTransition(mouseWorldPos)
        }
    }

    seamlessChunkTransition(mouseWorldPos) { // when the width of the line crosses over to neighbor chunk
        
        var worldWidth = this.widthToWorldDistance(this.width);

        var leftWorldPoint = mouseWorldPos.sub(new Point(worldWidth, 0)); // left most point of point + width
        var leftPointInChunk = World.worldPointToChunkId(leftWorldPoint);

        var rightWorldPoint = mouseWorldPos.add(new Point(worldWidth, 0));
        var rightPointInChunk = World.worldPointToChunkId(rightWorldPoint);

        var topWorldPoint = mouseWorldPos.sub(new Point(0, worldWidth));
        var topPointInChunk = World.worldPointToChunkId(topWorldPoint);

        var bottomWorldPoint = mouseWorldPos.add(new Point(0, worldWidth));
        var bottomPointInChunk = World.worldPointToChunkId(bottomWorldPoint);

        // if switching from one chunk to another
        // if (this.currentLeftOrRightChunk != null && this.currentLeftOrRightChunk.id.equals(World.worldPointToChunkId(mouseWorldPos))) {
        //     if (this.currentLeftOrRightLine.points.length <= 7) console.log("Remove")
        //     this.currentLeftOrRightLine = null;
        //     this.currentLeftOrRightChunk = null;
        // } else if (this.currentTopOrBottomChunk != null && this.currentTopOrBottomChunk.id.equals(World.worldPointToChunkId(mouseWorldPos))) {
        //     if (this.currentTopOrBottomLine.points.length <= 7) console.log("Remove")
        //     this.currentTopOrBottomLine = null;
        //     this.currentTopOrBottomChunk = null;
        // }

        if (!this.currentChunk.id.equals(leftPointInChunk)) {
            this.drawLineOnLeftOrRightChunk(leftWorldPoint, mouseWorldPos);
        } else if (!this.currentChunk.id.equals(rightPointInChunk)) {
            this.drawLineOnLeftOrRightChunk(rightWorldPoint, mouseWorldPos);
        } else {
            this.currentLeftOrRightChunk = null;
            this.currentLeftOrRightLine = null;
        }

        if (!this.currentChunk.id.equals(topPointInChunk)) {
            this.drawLineOnTopOrBottomChunk(topWorldPoint, mouseWorldPos);
        } else if (!this.currentChunk.id.equals(bottomPointInChunk)) {
            this.drawLineOnTopOrBottomChunk(bottomWorldPoint, mouseWorldPos);
        } else {
            this.currentTopOrBottomChunk = null;
            this.currentTopOrBottomLine = null;
        }
    }

    drawLineOnLeftOrRightChunk(positionInChunk, position) {
        if (this.currentLeftOrRightLine == null) {         
            this.currentLeftOrRightLine = new Line(positionInChunk, this.width, this.style);
            this.currentLeftOrRightChunk = Main.World.addObject(this.currentLeftOrRightLine);

            this.currentLeftOrRightLine.points.push(position);
            this.currentLeftOrRightLine.points.push(position);
            this.currentLeftOrRightChunk.updateLastLine(this.currentLeftOrRightLine);
        } else {
            // if first two points are the same remove one
            this.currentLeftOrRightLine.points.push(position);
            this.currentLeftOrRightChunk.updateLastLine(this.currentLeftOrRightLine);
        }
    }

    drawLineOnTopOrBottomChunk(positionInChunk, position) {
        if (this.currentTopOrBottomLine == null) {            
            this.currentTopOrBottomLine = new Line(positionInChunk, this.width, this.style);
            this.currentTopOrBottomChunk = Main.World.addObject(this.currentTopOrBottomLine);

            this.currentTopOrBottomLine.points.push(position);
            this.currentTopOrBottomLine.points.push(position);
            this.currentTopOrBottomChunk.updateLastLine(this.currentTopOrBottomLine);
        } else {
            this.currentTopOrBottomLine.points.push(position);
            this.currentTopOrBottomChunk.updateLastLine(this.currentTopOrBottomLine);
        }
    }

    onMouseUp(event) {
        this.endLine();
    }

    endLine() {
        this.currentChunk = null;
        this.currentLine = null;
        this.canDraw = false;

        // for seamless chunk transition
        this.currentLeftOrRightLine = null;
        this.currentLeftOrRightChunk = null;
        this.currentTopOrBottomLine = null;
        this.currentTopOrBottomChunk = null;
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
        this.seamlessChunkTransition(worldPoint)
    }

    widthToWorldDistance(width) {
        return width / 75.6;
    }

    snapPoint(worldPoint) {
        var center = worldPoint.floor().add(new Point(.5));
        if (center.distance(worldPoint) < this.snapSafeArea) return null;
        return worldPoint.round();
    }
}

export default Pen;