import { Mesh, PlaneGeometry, Texture, Vector2, Vector3 } from "three";
import { CSS2DObject } from "three/examples/jsm/Addons.js";
import { addCardinalToDirection, createPlaneMeshFromSvgTexture } from "./Utilities.ts";

class PolarCoordinate {
    radius: number
    azimuth: number // in degrees
    altitudeAngle: number // in degrees

    constructor(radius: number = 0, azimuth: number = 0, altitudeAngle: number = 0) {
        this.radius = radius;
        this.azimuth = azimuth;
        this.altitudeAngle = altitudeAngle;
    }

    // rotate counterclockwise x degrees
    rotate(angle: number): PolarCoordinate {
        return new PolarCoordinate(this.radius, this.azimuth - angle, this.altitudeAngle);
    }

    toCartesianCoordinates(): {x: number, y: number, z: number} {
        const angleRad = (-this.azimuth + 90) * Math.PI / 180;
        const altitudeRad = this.altitudeAngle * Math.PI / 180;
        return {
            x: this.radius * Math.cos(angleRad),
            y: this.radius * Math.sin(angleRad),
            z: this.radius * Math.sin(altitudeRad)
        }
    }
}

export default class Star {
    mesh: Mesh
    polarCoordinate = new PolarCoordinate();
    // text div references
    azimuthText: HTMLDivElement
    // altitudeAngleText: HTMLDivElement

    constructor(name: string, planeGeometry: PlaneGeometry, texture: Texture, cameraPosition: Vector3) {
        // 0. Mesh
        this.mesh = createPlaneMeshFromSvgTexture(planeGeometry, texture);
        this.mesh.up.set(0, 0, 1);
        this.mesh.lookAt(cameraPosition);

        // 1. Text
        const container = document.createElement("div");
        container.style.fontSize = "14px";
        // azimuth
        this.azimuthText = document.createElement("div");
        this.azimuthText.style.lineHeight = "normal";
        this.azimuthText.style.color = "rgba(255, 255, 255, 0.75)";
        container.appendChild(this.azimuthText);
        // name
        const nameText = document.createElement("div");
        nameText.style.fontWeight = "bold";
        nameText.style.lineHeight = "normal";
        nameText.textContent = name;
        container.appendChild(nameText);
        // altitude angle
        // this.altitudeAngleText = document.createElement("div");
        // this.altitudeAngleText.style.lineHeight = "normal";
        // container.appendChild(this.altitudeAngleText);

        const containerObject = new CSS2DObject(container);
        containerObject.center = new Vector2(0, 0.5);
        this.mesh.add(containerObject);
        containerObject.translateX(0.15);
    }

    updatePolarCoordinate(distance: number, azimuth: number, altitudeAngle: number) {
        this.polarCoordinate.radius = distance;
        this.polarCoordinate.azimuth = azimuth;
        this.polarCoordinate.altitudeAngle = altitudeAngle;
    }

    render(lookAzimuth: number, projectionPoints: number[]) {
        // 0. Update position
        const { x, y, z } = this.polarCoordinate.rotate(lookAzimuth).toCartesianCoordinates();
        this.mesh.position.set(x, y, z);

        // 1. Update texts
        this.azimuthText.innerText = `${addCardinalToDirection(this.polarCoordinate.azimuth)}`;
        // this.altitudeAngleText.innerText = `alt: ${this.polarCoordinate.altitudeAngle.toFixed(2)}°`;

        // 2. Add projection points
        projectionPoints.push(x, y, z);
        projectionPoints.push(x, y, 0);
        projectionPoints.push(x, y, 0);
        projectionPoints.push(0, 0, 0);
    }
}
