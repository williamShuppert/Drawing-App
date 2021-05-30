import Chunk from "./Chunk.js";
import DoubleSortedArray from "./DoubleSortedArray.js";
import Point from "./Point.js";


class World {

    constructor(camera) {
        this.camera = camera;
        this.chunkSize = new Point(25,25);
        this.chunks = new DoubleSortedArray();
    }

    render(canvas, camera) {
        this.chunks.forEach(chunk => {
            chunk.render(canvas, camera);
        });
    }

    addObject(obj, chunkId) {
        var chunk = this.chunks.get(chunkId.x, chunkId.y);
        if (chunk == null) {
            chunk = this.chunks.set(chunkId.x, chunkId.y, new Chunk(chunkId, this.chunkIdToChunkPos(chunkId), this.chunkSize.mult(new Point(this.camera.pixelPerWorldUnit()))));
            console.log("Added new Chunk");
        }
        chunk.lines.push(obj);
        return chunk;
    }

    chunkIdToChunkPos(chunkId) {
        return chunkId.mult(this.chunkSize);
    }

    pointToChunkId(worldPoint) {
        return new Point(worldPoint.div(this.chunkSize).floor());
    }
}

export default World;