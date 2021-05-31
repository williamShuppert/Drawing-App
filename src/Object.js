class Object {

    constructor(position) {
        if(this.constructor === Object)
            throw new Error("Instance of Abstract class cannot be instantiated");
        this.position = position;
        this.renderMode = Object.RenderModes.REGULAR;
        this.hoverable = false;
    }

    render() {

    }

    collides() {
        return false;
    }
}

Object.RenderModes = { // determines which array object will be added to in chunk
    REGULAR: 1,
    LIGHTING: 2
}

export default Object;