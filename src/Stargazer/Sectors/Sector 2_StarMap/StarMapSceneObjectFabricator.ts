import {
    AddCardinalToDirectionWithoutTrailingZeros,
    CreatePlaneMeshFromSvgTexture,
    ToThreeJsVector3
} from "./Utilities.ts";
import {
    BufferGeometry, Line,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    PlaneGeometry,
    Texture,
    Vector2
} from "three";
import { CSS2DObject } from "three/examples/jsm/Addons.js";
import { Const_MapRadius } from "../../../constants.ts";

const axisLineMaterial1 = new LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.5
});
const axisLineMaterial2 = new LineBasicMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.75
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

    CreateAxisLineY() {
        return new Line(
            new BufferGeometry().setFromPoints([
                ToThreeJsVector3(0, -Const_MapRadius, 0),
                ToThreeJsVector3(0, Const_MapRadius, 0)
            ]),
            axisLineMaterial1
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
        const textObject = this.CreateTextObject(AddCardinalToDirectionWithoutTrailingZeros(anAzimuth));
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
