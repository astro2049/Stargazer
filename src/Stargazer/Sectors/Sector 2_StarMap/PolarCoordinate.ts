import SG_Vector3 from "../../Common/SG_Vector3.ts";

export default class PolarCoordinate {
    private myAzimuth: number = 0;
    private myAltitudeAngle: number = 0;
    private myRadius: number = 0;
    // position
    private myPosition: SG_Vector3 = SG_Vector3.Zero();

    constructor(azimuth: number = 0, altitudeAngle: number = 0, radius: number = 0) {
        this.myAzimuth = azimuth;
        this.myAltitudeAngle = altitudeAngle;
        this.myRadius = radius;
        this.CalculatePos();
    }

    GetPolar(): SG_Vector3 {
        return new SG_Vector3(this.myAzimuth, this.myAltitudeAngle, this.myRadius);
    }
    GetPosition(): SG_Vector3 {
        return this.myPosition;
    }

    SetAzimuth(anAzimuth: number) {
        this.myAzimuth = anAzimuth;
        this.CalculatePos();
    }
    SetAltitudeAngle(anAltitudeAngle: number) {
        this.myAltitudeAngle = anAltitudeAngle;
        this.CalculatePos();
    }
    SetRadius(aRadius: number) {
        this.myRadius = aRadius;
        this.CalculatePos();
    }
    SetPolar(anAzimuth: number, anAltitudeAngle: number, aRadius: number) {
        this.myAzimuth = anAzimuth;
        this.myAltitudeAngle = anAltitudeAngle;
        this.myRadius = aRadius;
        this.CalculatePos();
    }

    CalculatePos(): void {
        const angleRad = this.myAzimuth * Math.PI / 180;
        const altitudeRad = this.myAltitudeAngle * Math.PI / 180;
        this.myPosition.x = this.myRadius * Math.cos(angleRad);
        this.myPosition.z = this.myRadius * Math.sin(angleRad);
        this.myPosition.y = this.myRadius * Math.sin(altitudeRad);
    }
}