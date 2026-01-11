import { Mesh, MeshBasicMaterial, PlaneGeometry, Texture, Vector3 } from "three";

function CreatePlaneMeshFromSvgTexture(aPlaneGeometry: PlaneGeometry, aTexture: Texture): Mesh {
    return new Mesh(aPlaneGeometry, new MeshBasicMaterial({
        map: aTexture,
        transparent: true,
        depthTest: false
    }));
}

function GetDirectionAndCardinalText(degrees: number, keepTrailingZeros: boolean): string {
    return `${keepTrailingZeros ? degrees.toFixed(1) : parseFloat(degrees.toFixed(2))}° ${GetCardinalText(degrees)}`;
}

const referenceDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

function GetCardinalText(degrees: number): string {
    const index = Math.round(degrees / 45) % 8;
    return referenceDirections[index];
}

function ToThreeJsVector3(x: number, y: number, z: number) {
    return new Vector3(x, y, -z);
}

export {
    CreatePlaneMeshFromSvgTexture,
    GetDirectionAndCardinalText,
    GetCardinalText,
    ToThreeJsVector3
};
