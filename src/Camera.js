import Main from "./Main.js";
import Point from "./Point.js";

class Camera {
    constructor(dimensions) {
        this.position = new Point();
        this.zoom = 1;
        this.zoomMax = 5;
        this.zoomMin = .1;
        this.dimensions = dimensions;
        this.maxChunk = 40; // how many chunks you can see horizontally when at 0% zoom
    }

    render() {
        Main.CTX.lineWidth = .5;
        Main.CTX.beginPath();
        for (var i = 0; i < this.cameraWorldWidth(); i++) {
            var p = this.worldToScreen(this.position.ceil().add(new Point(i)));
            Main.CTX.moveTo(p.x,0);
            Main.CTX.lineTo(p.x,window.innerHeight);
        }
        for (var i = 0; i < this.cameraWorldHeight(); i++) {
            var p = this.worldToScreen(this.position.ceil().add(new Point(i)));
            Main.CTX.moveTo(0,p.y);
            Main.CTX.lineTo(window.innerWidth,p.y);
        }
        Main.CTX.stroke();
    }

    zoomToPoint(point, zoomIn) {
        var point1 = this.screenToWorld(point);
        if (zoomIn) this.zoom += .05;
        else this.zoom -= .05;
        this.zoom = Math.max(this.zoom, this.zoomMin);
        this.zoom = Math.min(this.zoom, this.zoomMax);
        var point2 = this.screenToWorld(point);
        this.position = this.position.add(point1.sub(point2));
        console.log(this.zoom);
        Main.World.renderUpdate(); // make a listener in world or something
        Main.World.render();
    }

    getRelativeWidth(width) {
        return width;
        //return width * (this.zoomMin-this.zoom) / this.zoomMin;
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