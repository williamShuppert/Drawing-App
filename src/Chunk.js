import Main from "./Main.js";
import Point from "./Point.js";

class Chunk {
 
    constructor(id, size) {
        this.id = id; // position is top left of chunk
        this.position = Chunk.chunkIdToChunkPos(id);
        this.lines = new Array(); // in world position

        //var s = Chunk.size.mult(new Point(Main.Camera.pixelPerWorldUnit()))
        this.image = new OffscreenCanvas(0,0);
        this.resizeOffscreenCanvas();
        
        this.ctx = this.image.getContext("2d");
        this.ctx.lineWidth = 10;
        this.ctx.lineCap = "round";
    }

    // TODO: pass parameter of two points to draw to canvas
    updateLastLine(camera) { // this is used when drawing with the pen
        var point1 = this.lines[this.lines.length - 1][this.lines[this.lines.length - 1].length - 2]
        var point2 = this.lines[this.lines.length - 1][this.lines[this.lines.length - 1].length - 1]
        point1 = this.worldPosRelativeToChunkPos(point1);
        point2 = this.worldPosRelativeToChunkPos(point2);
        point1 = point1.add(Main.Camera.position);
        point2 = point2.add(Main.Camera.position);
        point1 = Main.Camera.worldToScreen(point1);
        point2 = Main.Camera.worldToScreen(point2);
        this.ctx.beginPath();
        this.ctx.lineTo(point1.x, point1.y);
        this.ctx.lineTo(point2.x, point2.y);
        this.ctx.stroke();

    }

    // Updates image on zoom and when drawn on
    update() {
        this.resizeOffscreenCanvas()

        this.ctx.lineCap = "round";
        this.ctx.lineJoin = "round";

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
    }

    worldPosRelativeToChunkPos(worldPos) {
        return worldPos.sub(this.position);
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