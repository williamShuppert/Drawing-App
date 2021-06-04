import Chunk from "./Chunk.js";
import DoubleSortedArray from "./DoubleSortedArray.js";
import Point from "./Point.js";
import Main from "./Main.js";


class World {

    constructor() {
        Chunk.size = new Point(25,25);
        this.chunks = new DoubleSortedArray();
        this.renderChunkBorders = true;
    }

    renderChunkImage() { // TODO: only render visible chunks
        this.chunks.forEach(chunk => {
            chunk.renderImage(this.renderChunkBorders);
        });
    }

    renderChunkImageOld() { // TODO: only update visible chunks
        this.chunks.forEach(chunk => {
            chunk.renderImageOld();
        });
    }

    rerender(canvas, camera) {
        this.chunks.forEach(chunk => {
            chunk.rerender(canvas, camera);
        });
    }

    addObject(obj) {
        var chunkId = World.worldPointToChunkId(obj.position);
        var chunk = this.chunks.get(chunkId.x, chunkId.y); // get chunk if it exists
        if (chunk == null) { // create new chunk if needed
            chunk = this.chunks.set(chunkId.x, chunkId.y, new Chunk(chunkId));
            console.log("Added new Chunk: " + chunkId);
        }
        chunk.objects.push(obj);
        console.log("Added Obj")
        return chunk; // return the chunk the object is in
    }

    static worldPointToChunkId(worldPoint) {
        return new Point(worldPoint.div(Chunk.size).floor());
    }
}

export default World;