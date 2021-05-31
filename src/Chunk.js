import Main from "./Main.js";
import Point from "./Point.js";

class Chunk {
 
    constructor(id, size) {
        this.id = id; // position is top left of chunk
        this.position = Chunk.chunkIdToChunkPos(id);

        this.objects = new Array();

        //var s = Chunk.size.mult(new Point(Main.Camera.pixelPerWorldUnit()))
        this.image = new OffscreenCanvas(0,0);
        this.ctx = this.image.getContext("2d");
        this.resizeOffscreenCanvas();
        this.ctx.lineWidth = 10; // remove later
    }

    // TODO: pass parameter of two points to draw to canvas
    updateLastLine(line) { // this is used when drawing with the pen

        var point1 = line.points[line.points.length - 1];
        var point2 = line.points[line.points.length - 2];
        point1 = this.worldPointToChunkScreenPoint(point1);
        point2 = this.worldPointToChunkScreenPoint(point2);
        this.ctx.beginPath();
        this.ctx.lineWidth = line.width;
        this.ctx.strokeStyle = line.style;
        this.ctx.lineTo(point1.x, point1.y);
        this.ctx.lineTo(point2.x, point2.y);
        this.ctx.stroke();
    }

    // Updates image on zoom and when drawn on
    update() {
        this.resizeOffscreenCanvas()

        this.objects.forEach(obj => {
            obj.render(this);
        });
        return;
        // Redraw all lines
        this.ctx.lineWidth = 10;
        this.lines.forEach(line => {
            this.ctx.beginPath();
            var p = this.worldPosRelativeToChunkPos(line[0]);
            p = p.add(Main.Camera.position);
            p = Main.Camera.worldToScreen(p);
            this.ctx.moveTo(p.x, p.y);
            line.forEach(point => {
                p = this.worldPosRelativeToChunkPos(point);
                p = p.add(Main.Camera.position);
                p = Main.Camera.worldToScreen(p);
                this.ctx.lineTo(p.x, p.y);
            });
            this.ctx.stroke();
        });

        // render
    }

    resizeOffscreenCanvas() {
        var offscreenCanvasSize = Chunk.size.mult(new Point(Main.Camera.pixelPerWorldUnit())).add(new Point(1));
        this.image.width = offscreenCanvasSize.x;
        this.image.height = offscreenCanvasSize.y;

        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";
    }

    worldPosRelativeToChunkPos(worldPos) {
        return worldPos.sub(this.position);
    }

    worldPointToChunkScreenPoint(worldPoint) {
        worldPoint = this.worldPosRelativeToChunkPos(worldPoint);
        worldPoint = worldPoint.add(Main.Camera.position);
        worldPoint = Main.Camera.worldToScreen(worldPoint);
        return worldPoint;
    }

    static chunkIdToChunkPos(chunkId) {
        return chunkId.mult(this.size);
    }

    render(temp, temp2, renderChunkBoarders) {
        var pos = Main.Camera.worldToScreen(this.position);
        Main.CTX.drawImage(this.image,pos.x,pos.y);
        
        // boarder around chunk
        if (!renderChunkBoarders) return;
        Main.CTX.strokeStyle = "rgb(255,0,0)";
        Main.CTX.strokeRect(pos.x, pos.y, this.image.width,this.image.height);
        Main.CTX.strokeStyle = "rgb(0,0,0)";
    }
}

Chunk.size = new Point(10, 10); // in world units


export default Chunk;