import Main from "./Main.js";
import Point from "./Point.js";

class Chunk {
 
    constructor(id, size) {
        this.id = id; // position is top left of chunk
        this.position = Chunk.chunkIdToChunkPos(id);

        this.objects = new Array();

        this.image = new OffscreenCanvas(0,0);
        this.ctx = this.image.getContext("2d");
        
        //if (Chunk.texture == undefined) Chunk.texture = this.ctx.createPattern(Chunk.imageTexture, "repeat");

        this.resizeOffscreenCanvas();
    }

    // TODO: pass parameter of two points to draw to canvas
    updateLastLine(line) { // this is used when drawing with the pen

        var point1 = line.points[line.points.length - 1];
        var point2 = line.points[line.points.length - 2];
        point1 = this.worldPointToChunkScreenPoint(point1);
        point2 = this.worldPointToChunkScreenPoint(point2);
        this.ctx.beginPath();
        this.ctx.lineWidth = Main.Camera.getRelativeWidth(line.width);
        this.ctx.strokeStyle = line.style;
        this.ctx.lineTo(point1.x, point1.y);
        this.ctx.lineTo(point2.x, point2.y);
        this.ctx.stroke();
    }

    // Updates image on zoom
    renderImageOld() { // renderImage
        var i = this.image.transferToImageBitmap();
        this.resizeOffscreenCanvas();
        this.ctx.drawImage(i,0,0,this.image.width, this.image.height);
    }

    // use when objects are changed
    rerender(temp, temp2, renderChunkBorder) {
        this.resizeOffscreenCanvas()
        //this.ctx.drawImage(Chunk.texture, 0,0, this.image.width, this.image.height);
        this.objects.forEach(obj => {
            obj.render(this);
        });    
    }

    resizeOffscreenCanvas() {
        var offscreenCanvasSize = Chunk.size.mult(new Point(Main.Camera.pixelPerWorldUnit())).add(new Point(1));
        this.image.width = offscreenCanvasSize.x;
        this.image.height = offscreenCanvasSize.y;

        //this.ctx.drawImage(Chunk.imageTexture, 0,0, offscreenCanvasSize.x, offscreenCanvasSize.y) // image background

        // pattern background
        // Chunk.texture.width = this.image.width;
        // Chunk.texture.height = this.image.height;
        // this.ctx.fillStyle = Chunk.texture;
        // this.ctx.fillRect(0, 0, this.image.width, this.image.height);

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

    // used when camera moving
    renderImage(renderChunkBorders) {
        var pos = Main.Camera.worldToScreen(this.position);
        Main.CTX.drawImage(this.image,pos.x,pos.y);
        
        // boarder around chunk
        if (!renderChunkBorders) return;
        Main.CTX.strokeStyle = "rgb(255,0,0)";
        Main.CTX.strokeRect(pos.x, pos.y, this.image.width,this.image.height);
        Main.CTX.strokeStyle = "rgb(0,0,0)";
    }
}

Chunk.size = new Point(10, 10); // in world units
Chunk.imageTexture = new Image(50,50);
Chunk.imageTexture.src = "./images/black_paper.png";
Chunk.texture;


export default Chunk;