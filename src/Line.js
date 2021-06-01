import Object from "./Object.js";
import Main from "./Main.js";

class Line extends Object {
    constructor(position, width, style) {
        super(position);
        this.points = new Array(); // world position
        this.style = style;
        this.width = width;
        //this.style = "rgb("+Math.floor(Math.random() * 255)+","+Math.floor(Math.random() * 255)+","+Math.floor(Math.random() * 255)+")";
    }

    render(chunk, camera) {
        var point = chunk.worldPointToChunkScreenPoint(this.points[0])
        chunk.ctx.beginPath();
        chunk.ctx.lineWidth = Main.Camera.getRelativeWidth(this.width);
        chunk.ctx.strokeStyle = this.style;
        chunk.ctx.lineTo(point.x, point.y);
        for (var i = 1; i < this.points.length; i++) {
            point = chunk.worldPointToChunkScreenPoint(this.points[i])
            chunk.ctx.lineTo(point.x, point.y);
        }
        chunk.ctx.stroke();
    }

    collides(point) {
        this.points.forEach(p => {
            if (p.distance(point) <= this.width) {
                return true;
            }
        });
    }
}

export default Line;