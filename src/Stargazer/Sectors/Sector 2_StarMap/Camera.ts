import PolarCoordinate from "./PolarCoordinate.ts";
import { Camera as ThreeCamera, OrthographicCamera } from "three";
import { Const_CameraDistance, Const_CameraViewSize } from "../../../constants.ts";

export default class Camera {
    private myInitialPolarCoordinate: PolarCoordinate = new PolarCoordinate();
    private myAzimuthOffset: number = 0;
    myThreeCamera: ThreeCamera;

    constructor() {
        this.myThreeCamera = new OrthographicCamera(
            -Const_CameraViewSize / 2,
            Const_CameraViewSize / 2,
            Const_CameraViewSize / 2,
            -Const_CameraViewSize / 2,
            0.1,
            100
        );

        this.Initialize(new PolarCoordinate(-45, 30, Const_CameraDistance));
    }

    Initialize(aPolarCoordinate: PolarCoordinate) {
        this.myInitialPolarCoordinate = aPolarCoordinate;
        this.SetThreeCameraPosition();
    }

    SetAzimuthOffset(anAzimuthOffset: number) {
        this.myAzimuthOffset = anAzimuthOffset;
        this.SetThreeCameraPosition();
    }

    GetAzimuth() {
        return this.myInitialPolarCoordinate.GetPolar().x + this.myAzimuthOffset;
    }

    private SetThreeCameraPosition() {
        const { x: azimuth, y: altitudeAngle, z: radius } = this.myInitialPolarCoordinate.GetPolar();
        const polarCoordinate = new PolarCoordinate(azimuth + this.myAzimuthOffset, altitudeAngle, radius);
        const { x, y, z } = polarCoordinate.GetPosition().ToThreeJsVector3();
        this.myThreeCamera.position.set(x, y, z);
        this.myThreeCamera.lookAt(0, 0, 0);
    }
}
