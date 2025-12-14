import {
    Mesh,
    MeshBasicMaterial, PlaneGeometry,
    Texture,
} from "three";
import { CSS2DObject } from "three/examples/jsm/Addons.js";

function createPlaneMeshFromSvgTexture(planeGeometry: PlaneGeometry, texture: Texture): Mesh {
    return new Mesh(planeGeometry, new MeshBasicMaterial({
        map: texture,
        transparent: true
    }));
}

function createTextObject(text: string): CSS2DObject {
    const textDiv = document.createElement("div");
    textDiv.style.fontSize = "14px";
    textDiv.style.fontWeight = "bold";
    textDiv.innerText = text;
    return new CSS2DObject(textDiv);
}

const referenceDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

function addCardinalToDirectionWithoutTrailingZeros(degrees: number): string {
    const index = Math.round(degrees / 45) % 8;

    return `${parseFloat(degrees.toFixed(2))}° ${referenceDirections[index]}`;
}

function addCardinalToDirection(degrees: number): string {
    const index = Math.round(degrees / 45) % 8;

    return `${degrees.toFixed(2)}° ${referenceDirections[index]}`;
}

export {
    createPlaneMeshFromSvgTexture,
    createTextObject,
    addCardinalToDirectionWithoutTrailingZeros,
    addCardinalToDirection
};
