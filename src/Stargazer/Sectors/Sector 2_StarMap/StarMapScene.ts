import {
    AmbientLight, Texture, TextureLoader
} from "three";
import ThreeJsScene, { SceneConfig } from "./ThreeJsScene.ts";
import cross from "../../../images/cross_lime_rotated.svg";
import triangleImage from "../../../images/triangle_orange.svg";
import { MutableRefObject } from "react";
import { Body } from "astronomy-engine";
import { StarPosition } from "../../Main.tsx";
import compass from "../../../images/compass.png"
import Star from "./Star.ts";
import {
    GetDirectionAndCardinalText
} from "./Utilities.ts";
import arrowLime from "../../../images/arrow_lime.svg"
import arrowLimeDimmer from "../../../images/arrow_lime_dimmer.svg"
import { CSS2DObject } from "three/examples/jsm/Addons.js";
import StarMapSceneObjectFabricator from "./StarMapSceneObjectFabricator.ts";
import PolarCoordinate from "./PolarCoordinate.ts";
import {
    Const_CameraDistance
} from "../../../constants.ts";

class StarMapScene extends ThreeJsScene {
    /* I. Member variables */
    // I.1. scene objects
    lookDirectionTextUI!: CSS2DObject;
    stars: Map<Body, Star> = new Map<Body, Star>();
    // I.2. data
    lookAzimuth = 0; // azimuth, in degrees
    // I.3. marker - are texture loaded and scene is ready?
    isReady = false;
    // I.4. object fabricator
    myObjectFabricator: StarMapSceneObjectFabricator = new StarMapSceneObjectFabricator();

    /* II. Functions - Constructor */
    // II.1. Constructor
    constructor(config: SceneConfig, canvasRef: MutableRefObject<HTMLDivElement>, bodies: Body[]) {
        // 0. Set up scene, renderer, camera, lighting
        super(config, canvasRef);

        // 1. create widgets
        this.CreateWidgets();

        // 5. create widgets with textures
        this.CreateWidgetsWithTextures(bodies)
            .then(() => {
                this.isReady = true;
            })
            .catch((e) => {
                console.log(e);
            });
    }

    /* III. Functionalities */
    UpdateStarPositions(starPositions: Map<Body, StarPosition>): void {
        if (!this.isReady) {
            return;
        }

        // 1. Figure out the stars' orbits on map
        const entries = [...starPositions];
        entries.sort(([, posA], [, posB]) => {
            return posA.dist - posB.dist;
        });

        // 2. Update the stars' coordinates on map
        for (let i = 0; i < entries.length; i++) {
            const [body] = entries[i];
            const distance = (i + 1.5) * 0.225;
            this.stars.get(body)?.myPolarCoordinate.SetPolar(starPositions.get(body)!.az, starPositions.get(body)!.alt, distance);
        }

        // Update stars (mesh positions, texts)
        for (const [, star] of this.stars) {
            this.removeObjectFromScene(star.lineToCenter);
            this.removeObjectFromScene(star.lineToXZPlane);
            star.UpdateMeshPosition();
            this.addObjectToScene(star.lineToCenter);
            this.addObjectToScene(star.lineToXZPlane);
        }

        this.render();
    }

    UpdateLookDirection(direction: number): void {
        if (!this.isReady) {
            return;
        }

        this.lookAzimuth = direction;
        this.lookDirectionTextUI.element.textContent = GetDirectionAndCardinalText(direction, false);
        this.myCamera.SetAzimuthOffset(-this.lookAzimuth);

        // Update stars (mesh rotations)
        for (const [, star] of this.stars) {
            star.UpdateMeshRotation(this.myCamera);
        }

        this.render();
    }

    // II.5. Camera
    // Imagine we're standing from 5m looking at a 3m * 3m screen/wall
    setUpCamera(): void {
        this.myCamera.Initialize(new PolarCoordinate(-45, 45, Const_CameraDistance));
        this.addObjectToScene(this.myCamera.myThreeCamera);
    }

    // II.6. Lighting
    addLighting(): void {
        const light = new AmbientLight(0xffffff);
        this.addObjectToScene(light);
    }

    // II.7. Create widgets without textures
    CreateWidgets() {
        // 1. add look direction text
        this.lookDirectionTextUI = this.myObjectFabricator.CreateLookDirectionText(this.lookAzimuth);
        this.myCamera.myThreeCamera.attach(this.lookDirectionTextUI);
        // 2. add coordinate axes
        // this.addObjectToScene(this.myObjectFabricator.CreateAxisLineX());
        this.myCamera.myThreeCamera.attach(this.myObjectFabricator.CreateLocalAxisLineX());
        this.myCamera.myThreeCamera.attach(this.myObjectFabricator.CreateAxisLineYPositive());
        this.myCamera.myThreeCamera.attach(this.myObjectFabricator.CreateAxisLineYNegative());
        this.addObjectToScene(this.myObjectFabricator.CreateAxisLineZ());
        this.myCamera.myThreeCamera.attach(this.myObjectFabricator.CreateLocalAxisLineZ());
        // 3. add axis forward
        this.myCamera.myThreeCamera.attach(this.myObjectFabricator.CreateAxisLineForward());
        // 4. add zenith text
        this.addObjectToScene(this.myObjectFabricator.CreateZenithText());
        // 5. add earth dome
        this.addObjectToScene(this.myObjectFabricator.CreateEarthDome());
    }

    // II.8. Create widgets with textures
    async CreateWidgetsWithTextures(stars: Body[]): Promise<void> {
        // load SVGs
        const textureLoader = new TextureLoader();
        try {
            // 0. wait for all textures to load
            const [compassTexture, triangleTexture, crossTexture, arrowLimeTexture, arrowLimeDimmerTexture] = await Promise.all([
                textureLoader.loadAsync(compass),
                textureLoader.loadAsync(triangleImage),
                textureLoader.loadAsync(cross),
                textureLoader.loadAsync(arrowLime),
                textureLoader.loadAsync(arrowLimeDimmer)
            ]);
            // 1. add meshes from the loaded textures
            // 1.1. add compass
            this.addObjectToScene(this.myObjectFabricator.CreateCompass(compassTexture));
            // 1.2. add stars (triangle icons and texts)
            this.InitializeStars(stars, triangleTexture);
            // 1.3. add center cross
            const centerCross = this.myObjectFabricator.CreateCross(crossTexture);
            centerCross.rotation.z = Math.PI / 4;
            this.myCamera.myThreeCamera.attach(centerCross);
            // 1.4. add you
            this.myCamera.myThreeCamera.attach(this.myObjectFabricator.CreateYouText());
            // 1.5. forward arrow
            this.myCamera.myThreeCamera.attach(this.myObjectFabricator.CreateForwardArrow(arrowLimeTexture));
            // 1.6. zenith arrow
            const zenithArrow = this.myObjectFabricator.CreateZenithArrow(arrowLimeDimmerTexture);
            zenithArrow.lookAt(this.myCamera.myThreeCamera.position);
            this.myCamera.myThreeCamera.attach(zenithArrow);

            // 2. Render the scene after adding the meshes
            this.render();
        } catch (error) {
            console.error("error loading textures", error);
        }
    }

    // II.9. Create star meshes and texts
    InitializeStars(starNames: Body[], aTriangleTexture: Texture): void {
        for (const starName of starNames) {
            const star = new Star(starName.toString(), aTriangleTexture);
            star.UpdateMeshRotation(this.myCamera);
            this.stars.set(starName, star);
            this.addObjectToScene(star.myMesh);
        }
    }
}

export default StarMapScene;
