import { Mesh, MeshBasicMaterial, PlaneGeometry, Texture, Vector3 } from "three";

const referenceDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

function CreatePlaneMeshFromSvgTexture(aPlaneGeometry: PlaneGeometry, aTexture: Texture): Mesh {
    return new Mesh(aPlaneGeometry, new MeshBasicMaterial({
        map: aTexture,
        transparent: true
    }));
}

function AddCardinalToDirectionWithoutTrailingZeros(degrees: number): string {
    const index = Math.round(degrees / 45) % 8;
    return `${parseFloat(degrees.toFixed(2))}° ${referenceDirections[index]}`;
}

function AddCardinalToDirection(degrees: number): string {
    const index = Math.round(degrees / 45) % 8;
    return `${degrees.toFixed(1)}° ${referenceDirections[index]}`;
}

function ToThreeJsVector3(x: number, y: number, z: number) {
    return new Vector3(x, y, -z);
}

export {
    CreatePlaneMeshFromSvgTexture,
    AddCardinalToDirectionWithoutTrailingZeros,
    AddCardinalToDirection,
    ToThreeJsVector3
};
