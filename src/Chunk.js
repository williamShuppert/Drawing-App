import Main from "./Main.js";
import Point from "./Point.js";

class Chunk {
 
    constructor(id, position, size) {
        this.id = id; // position is top left of chunk
        this.position = position;
        this.lines = new Array(); // in world position
        this.image = new OffscreenCanvas(size.x, size.y);
        
        this.ctx = this.image.getContext("2d");
        this.ctx.lineWidth = 10;
        this.ctx.lineCap = "round";
    }
    
    worldPosRelativeToChunkPos(worldPos) {
        return worldPos.sub(this.position);
    }

    updateLastLine(camera) { // change to update last segment in last line // this is used when drawing with the pen
        var point1 = this.lines[this.lines.length - 1][this.lines[this.lines.length - 1].length - 2]
        var point2 = this.lines[this.lines.length - 1][this.lines[this.lines.length - 1].length - 1]
        point1 = this.worldPosRelativeToChunkPos(point1);
        point2 = this.worldPosRelativeToChunkPos(point2);
        point1 = point1.add(Main.camera.position);
        point2 = point2.add(Main.camera.position);
        point1 = Main.camera.worldToScreen(point1);
        point2 = Main.camera.worldToScreen(point2);
        this.ctx.beginPath();
        this.ctx.lineTo(point1.x, point1.y);
        this.ctx.lineTo(point2.x, point2.y);
        this.ctx.stroke();
        /*
        var points = this.lines[this.lines.length - 1];
        this.ctx.beginPath();
        points.forEach(point => {
            point = this.worldPosRelativeToChunkPos(point);
            point = point.add(camera.position);
            point = camera.worldToScreen(point);
            this.ctx.lineTo(point.x, point.y);
        })
        this.ctx.stroke();
        */
    }

    // Updates image on zoom and when drawn on
    update(zoom) {
        this.image.width = 100;
        this.image.height = 100;

        // Redraw all lines

    }

    render(canvas, camera) {
        var pos = camera.worldToScreen(this.position);
        canvas.drawImage(this.image,pos.x,pos.y);
        
        // boarder around chunk
        canvas.strokeStyle = "rgb(255,0,0)";
        canvas.strokeRect(pos.x, pos.y, this.image.width,this.image.height);
        canvas.strokeStyle = "rgb(0,0,0)";
    }
}

Chunk.size = new Point(10, 10);


export default Chunk;