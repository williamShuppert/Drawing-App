
class Object {

    constructor() {
        if(this.constructor === Object)
            throw new Error("Instance of Abstract class cannot be instantiated");
        this.hoverable = false;           
    }

    render() {

    }

    collides() {
        return false;
    }
}

export default Object;