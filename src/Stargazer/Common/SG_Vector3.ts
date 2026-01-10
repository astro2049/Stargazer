import { Vector3 } from "three";

export default class SG_Vector3 {
    x: number = 0
    y: number = 0
    z: number = 0

    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x
        this.y = y
        this.z = z
    }

    Add(aVector3: SG_Vector3): SG_Vector3 {
        return new SG_Vector3(
            this.x + aVector3.x,
            this.y + aVector3.y,
            this.z + aVector3.z
        )
    }

    static Zero(): SG_Vector3 {
        return new SG_Vector3(0, 0, 0);
    }

    ToThreeJsVector3(): Vector3 {
        return new Vector3(this.x, this.y, -this.z);
    }
}
