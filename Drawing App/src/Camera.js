import Point from "./Point.js";

class Camera {
    constructor(dimensions) {
        this.position = new Point();
        this.zoom = 1; // range from 0 to 1
        this.dimensions = dimensions;
        this.maxChunk = 40; // how many chunks you can see horizontally when at 0% zoom
    }

    render(canvas) {
        canvas.lineWidth = 1;
        canvas.beginPath();
        for (var i = 0; i < this.cameraWorldWidth(); i++) {
            var p = this.worldToScreen(this.position.ceil().add(new Point(i)));
            canvas.moveTo(p.x,0);
            canvas.lineTo(p.x,window.innerHeight);
        }
        for (var i = 0; i < this.cameraWorldHeight(); i++) {
            var p = this.worldToScreen(this.position.ceil().add(new Point(i)));
            canvas.moveTo(0,p.y);
            canvas.lineTo(window.innerWidth,p.y);
        }
        canvas.stroke();
    }

    cameraWorldWidth() {
        return window.innerWidth / this.pixelPerWorldUnit();
    }

    cameraWorldHeight() {
        return window.innerHeight / this.pixelPerWorldUnit();
    }

    pixelPerWorldUnit() {
        return window.innerWidth / (this.zoom * this.maxChunk);
    }

    screenToWorld(screenPoint) {
        return screenPoint.div(new Point(new Point(this.pixelPerWorldUnit()))).add(this.position);
    }

    worldToScreen(worldPoint) {
        return worldPoint.sub(this.position).mult(new Point(this.pixelPerWorldUnit()));
    }
}

export default Camera;