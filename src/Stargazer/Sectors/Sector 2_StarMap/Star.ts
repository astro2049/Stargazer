import {
    BufferGeometry, Line, LineBasicMaterial, LineDashedMaterial,
    Mesh,
    PlaneGeometry, Texture,
    Vector2, Vector3
} from "three";
import { CSS2DObject } from "three/examples/jsm/Addons.js";
import { AddCardinalToDirection, CreatePlaneMeshFromSvgTexture } from "./Utilities.ts";
import PolarCoordinate from "./PolarCoordinate.ts";
import Camera from "./Camera.ts";
import SG_Vector3 from "../../Common/SG_Vector3.ts";

const Const_LineMaterial = new LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.25
});
const Const_DashedLineMaterial = new LineDashedMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.15,
    dashSize: 0.1,
    gapSize: 0.06,
});

export default class Star {
    myMesh: Mesh;
    myPolarCoordinate = new PolarCoordinate();
    // text div references
    myAzimuthText!: HTMLDivElement;
    // myAltitudeAngleText!: HTMLDivElement;
    // lines
    lineToCenter: Line = new Line();
    lineToXZPlane: Line = new Line();

    constructor(aName: string, aTriangleTexture: Texture) {
        // 0. mesh
        this.myMesh = CreatePlaneMeshFromSvgTexture(new PlaneGeometry(0.175, 0.175), aTriangleTexture);
        this.myMesh.rotation.order = "YXZ";
        this.myMesh.rotation.x = -30 * Math.PI / 180;

        // 1. texts
        this.CreateTexts(aName);
    }

    UpdateMeshPosition(): void {
        // 0. Update position
        const { x, y, z } = this.CalculatePos().ToThreeJsVector3();
        this.myMesh.position.set(x, y, z);

        // 1. Update texts
        this.myAzimuthText.innerText = `${AddCardinalToDirection(this.myPolarCoordinate.GetPolar().x)}`;
        // const altitudeAngle: number = this.myPolarCoordinate.GetPolar().y;
        // this.myAltitudeAngleText.innerText = `${altitudeAngle > 0 ? "+" : ""}${altitudeAngle.toFixed(1)}°`;

        this.lineToCenter = new Line(
            new BufferGeometry().setFromPoints([
                new Vector3(x, y, z),
                new Vector3(0, 0, 0)
            ]),
            Const_LineMaterial
        );
        this.lineToXZPlane = new Line(
            new BufferGeometry().setFromPoints([
                new Vector3(x, y, z),
                new Vector3(x, 0, z),
                new Vector3(x, 0, z),
                new Vector3(0, 0, 0)
            ]),
            Const_DashedLineMaterial
        );
        this.lineToXZPlane.computeLineDistances();
    }

    CalculatePos(): SG_Vector3 {
        const { x: azimuth, y: altitudeAngle, z: radius } = this.myPolarCoordinate.GetPolar();
        const angleRad = Math.PI / 2 - azimuth * Math.PI / 180;
        const altitudeRad = altitudeAngle * Math.PI / 180;
        return new SG_Vector3(radius * Math.cos(angleRad), radius * Math.sin(altitudeRad), radius * Math.sin(angleRad));
    }

    UpdateMeshRotation(aCamera: Camera): void {
        this.myMesh.rotation.y = (aCamera.GetAzimuth() + 90) * Math.PI / 180;
    }

    private CreateTexts(aName: string): void {
        const divElement = document.createElement("div");
        divElement.style.fontSize = "14px";
        // name
        const nameText = document.createElement("div");
        nameText.style.fontWeight = "bold";
        nameText.style.lineHeight = "normal";
        nameText.textContent = aName;
        divElement.appendChild(nameText);
        // azimuth
        this.myAzimuthText = document.createElement("div");
        this.myAzimuthText.style.lineHeight = "normal";
        this.myAzimuthText.style.color = "rgba(255, 255, 255, 0.75)";
        divElement.appendChild(this.myAzimuthText);
        // altitude angle
        // this.myAltitudeAngleText = document.createElement("div");
        // this.myAltitudeAngleText.style.lineHeight = "normal";
        // this.myAltitudeAngleText.style.color = "rgba(255, 255, 255, 0.75)";
        // divElement.appendChild(this.myAltitudeAngleText);

        const container = new CSS2DObject(divElement);
        container.center = new Vector2(0, 0.5);
        this.myMesh.add(container);
        container.translateX(0.15);
    }
}
