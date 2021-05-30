import Chunk from "./Chunk.js";
import DoubleSortedArray from "./DoubleSortedArray.js";
import Point from "./Point.js";
import Main from "./Main.js";


class World {

    constructor(camera) {
        Chunk.size = new Point(25,25);
        this.chunks = new DoubleSortedArray();
    }

    render(canvas, camera) {
        this.chunks.forEach(chunk => {
            chunk.render(canvas, camera);
        });
    }

    renderUpdate() {
        this.chunks.forEach(chunk => {
            chunk.update();
        });
    }

    addObject(obj, chunkId) {
        var chunk = this.chunks.get(chunkId.x, chunkId.y); // get chunk if it exists
        if (chunk == null) { // create new chunk if needed
            chunk = this.chunks.set(chunkId.x, chunkId.y, new Chunk(chunkId));
            console.log("Added new Chunk");
        }
        chunk.lines.push(obj);
        return chunk; // return the chunk the object is in
    }

    static worldPointToChunkId(worldPoint) {
        return new Point(worldPoint.div(Chunk.size).floor());
    }
}

export default World;