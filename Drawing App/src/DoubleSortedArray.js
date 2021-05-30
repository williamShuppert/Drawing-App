class DoubleSortedArray {
    //data = [ 
    //    [x1, [ [y1,obj-x1y1],[y2,obj-x1y2] ] ],
    //    [x2, [ [y1,obj-x2y1],[y2,obj-x2y2] ] ] 
    //]
    #data = []
    // size = how many cords there are
    #size = 0
    get size() {return this.#size}

    // returns true if succesful and false otherwise
    remove(x,y) {
        let xIndex = this.binarySearch(x, this.#data, 0)
        if (xIndex[0]) {
            let yIndex = this.binarySearch(y,this.#data[xIndex[1]][1],0)
            if (yIndex[0]) {
                this.#data[xIndex[1]][1].splice(yIndex[1],1)
                if (this.#data[xIndex[1]][1].length == 0) {
                    this.#data.splice(xIndex[1],1)
                }
                return true
            }
        }
        return false
    }

    // returns boolean if x,y exists
    has(x,y) {
        if (this.get(x,y)) return true
        return false
    }

    // returns obj or null if it doesn't exist
    get(x,y) {
        let xIndex = this.binarySearch(x, this.#data, 0)
        if (xIndex[0]) {
            let yIndex = this.binarySearch(y,this.#data[xIndex[1]][1],0)
            if (yIndex[0]) {
                return this.#data[xIndex[1]][1][yIndex[1]][1]
            }
        }
        return null
    }

    // sets x,y to obj if it exists otherwise it is added
    // returns obj
    set(x,y,obj) {
        let xIndex = this.binarySearch(x, this.#data, 0)
        if (!xIndex[0]) { // add new x
            this.#data.splice(xIndex[1],0,[x,[[y,obj]]])
            this.#size++
        } else { // set existing x
            let yIndex = this.binarySearch(y,this.#data[xIndex[1]][1],0)
            if (!yIndex[0]) { // add new y
                this.#data[xIndex[1]][1].splice(yIndex[1],0,[y,obj])
                this.#size++
            } else { // set existing y
                this.#data[xIndex[1]][1][yIndex[1]][1] = obj
            }
        }
        return obj
    }

    // returns tuple
    // tuple[0] = boolean:  if num was found
    // tuple[1] = int:      index where num was found at or index where num should be inserted
    binarySearch(num, array, index) {
        //if (num < array[0][index]) return [false,0]
        let start = 0 
        let end = array.length-1; 
        let mid
        while (start<=end) {
            mid=Math.floor((start + end)/2);
            
            if (array[mid][index]==num) return [true,mid];
            else if (array[mid][index] < num) start = mid + 1;
            else end = mid - 1;
        }
        return [false,start]; 
    } 

    forEach(func) {
        for (let x = 0; x < this.#data.length; x++) {
            for (let y = 0; y < this.#data[x][1].length; y++) {
                func(this.#data[x][1][y][1])//func(this.#data[x][0],this.#data[x][1][y][0],this.#data[x][1][y][1])
            }
        }
    }

    toString() {
        let str = ""
        for (let x = 0; x < this.#data.length; x++) {
            str += "x: " + this.#data[x][0] + ", y: "
            for (let y = 0; y < this.#data[x][1].length; y++) {
                str += this.#data[x][1][y][0] + " "
            }
            str += "\n"
        }
        return str
    }
}

export default DoubleSortedArray;