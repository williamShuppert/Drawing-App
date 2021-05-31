class Line extends Object {
    constructor() {
        super();
        this.points = new Array();
        this.color = "rgb(0,0,0)";
        this.width = 5;
    }

    render() {

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