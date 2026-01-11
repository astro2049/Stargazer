import {
    GetDirectionAndCardinalText,
    CreatePlaneMeshFromSvgTexture,
    ToThreeJsVector3
} from "./Utilities.ts";
import {
    BufferGeometry, CanvasTexture, Line, LineBasicMaterial,
    Mesh,
    MeshBasicMaterial, MeshStandardMaterial,
    PlaneGeometry,
    SphereGeometry,
    Texture,
    Vector2
} from "three";
import { CSS2DObject } from "three/examples/jsm/Addons.js";
import { Const_MapRadius } from "../../../constants.ts";

const axisLineMaterial0 = new LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.25,
    depthTest: false
});
const axisLineMaterial1 = new LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5,
    depthTest: false
});
const axisLineMaterial2 = new LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.75,
    depthTest: false
});

export default class StarMapSceneObjectFabricator {
    CreateAxisLineX() {
        return new Line(
            new BufferGeometry().setFromPoints([
                ToThreeJsVector3(-Const_MapRadius, 0, 0),
                ToThreeJsVector3(Const_MapRadius, 0, 0)
            ]),
            axisLineMaterial1
        );
    }

    CreateAxisLineYPositive() {
        return new Line(
            new BufferGeometry().setFromPoints([
                ToThreeJsVector3(0, 0, 0),
                ToThreeJsVector3(0, Const_MapRadius, 0)
            ]),
            axisLineMaterial1
        );
    }
    CreateAxisLineYNegative() {
        return new Line(
            new BufferGeometry().setFromPoints([
                ToThreeJsVector3(0, -Const_MapRadius, 0),
                ToThreeJsVector3(0, 0, 0)
            ]),
            axisLineMaterial0
        );
    }

    CreateZenithText(): CSS2DObject {
        const textObject = this.CreateTextObject("Zenith");
        textObject.element.style.fontWeight = "normal";
        textObject.element.style.color = "rgba(255, 255, 255, 0.5)";
        const { x, y, z } = ToThreeJsVector3(0, Const_MapRadius + 0.3, 0);
        textObject.position.set(x, y, z);
        return textObject;
    }

    CreateEarthDome(): Mesh {
        const domeRadius = Const_MapRadius * 1.25;
        const geometry = new SphereGeometry(
            domeRadius,
            32,
            16,
            0,
            Math.PI * 2,
            0,
            Math.PI / 4
        );
        const material = new MeshStandardMaterial({
            color: 0xd6b089,
            transparent: true,
            alphaMap: this.CreateVerticalAlphaMap(),
            depthTest: false
        });
        const earthDome = new Mesh(geometry, material);
        earthDome.position.y = -domeRadius;
        return earthDome;
    }

    CreateVerticalAlphaMap(): CanvasTexture {
        const canvas = document.createElement("canvas");
        canvas.width = 1;
        canvas.height = 128;
        const gradient = canvas.getContext("2d")!.createLinearGradient(0, 128, 0, 0);
        gradient.addColorStop(1, "#aaaaaa");
        gradient.addColorStop(0, "#000000");
        canvas.getContext("2d")!.fillStyle = gradient;
        canvas.getContext("2d")!.fillRect(0, 0, 1, 128);
        return new CanvasTexture(canvas);
    }

    CreateZenithArrow(aTexture: Texture): Mesh {
        const mesh = new Mesh(
            new PlaneGeometry(0.15, 0.15),
            new MeshBasicMaterial({
                map: aTexture,
                transparent: true
            })
        );
        mesh.position.y = Const_MapRadius + 0.1;
        return mesh;
    }

    CreateAxisLineZ() {
        return new Line(
            new BufferGeometry().setFromPoints([
                ToThreeJsVector3(0, 0, -Const_MapRadius),
                ToThreeJsVector3(0, 0, Const_MapRadius)
            ]),
            axisLineMaterial1
        );
    }

    CreateAxisLineForward() {
        return new Line(
            new BufferGeometry().setFromPoints([
                ToThreeJsVector3(0, 0, 0),
                ToThreeJsVector3(0, 0, Const_MapRadius)
            ]),
            axisLineMaterial2
        );
    }

    CreateLookDirectionText(anAzimuth: number): CSS2DObject {
        const textObject = this.CreateTextObject(GetDirectionAndCardinalText(anAzimuth, false));
        textObject.center = new Vector2(0.5, 1);
        const { x, y, z } = ToThreeJsVector3(0, 0.1, Const_MapRadius + 0.1);
        textObject.position.set(x, y, z);
        return textObject;
    }

    CreateCompass(aTexture: Texture): Mesh {
        const mesh = new Mesh(
            new PlaneGeometry(6, 6),
            new MeshBasicMaterial({
                map: aTexture,
                transparent: true
            })
        );
        mesh.rotation.set(-Math.PI / 2, 0, 0);
        return mesh;
    }

    CreateCross(aTexture: Texture): Mesh {
        const mesh = CreatePlaneMeshFromSvgTexture(new PlaneGeometry(0.175, 0.175), aTexture);
        mesh.rotation.set(-Math.PI / 2, 0, 0);
        mesh.position.y = 0.01;
        return mesh;
    }

    CreateYouText(): CSS2DObject {
        const textObject = this.CreateTextObject("You");
        textObject.translateX(0.25);
        return textObject;
    }

    CreateForwardArrow(aTexture: Texture): Mesh {
        const mesh = new Mesh(
            new PlaneGeometry(0.2, 0.2),
            new MeshBasicMaterial({
                map: aTexture,
                transparent: true
            })
        );
        const { x, y, z } = ToThreeJsVector3(0, 0.01, Const_MapRadius + 0.1);
        mesh.rotation.set(-Math.PI / 2, 0, 0);
        mesh.position.set(x, y, z);
        return mesh;
    }

    private CreateTextObject(text: string): CSS2DObject {
        const textDiv = document.createElement("div");
        textDiv.style.fontSize = "14px";
        textDiv.style.fontWeight = "bold";
        textDiv.innerText = text;
        return new CSS2DObject(textDiv);
    }
}
