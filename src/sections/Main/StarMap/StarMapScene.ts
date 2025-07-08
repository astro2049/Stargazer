import {
    AmbientLight, BufferGeometry, Float32BufferAttribute, Line,
    LineBasicMaterial, LineSegments,
    Mesh,
    MeshBasicMaterial,
    OrthographicCamera,
    PlaneGeometry, Texture,
    TextureLoader,
    Vector2,
    Vector3
} from "three";
import ThreeJsScene, { SceneConfig } from "../ThreeJsScene.ts";
import triangle from "../../../images/triangle_orange.svg";
import cross from "../../../images/cross_lime_rotated.svg";
import { MutableRefObject } from "react";
import { Body } from "astronomy-engine";
import { CSS2DObject } from "three/examples/jsm/Addons.js";
import { StarPosition } from "../Main.tsx";
import compass from "../../../images/compass.png"
import Star from "./Star.ts";
import {
    addCardinalToDirectionWithoutTrailingZeros,
    createPlaneMeshFromSvgTexture,
    createTextObject
} from "./Utilities.ts";
import arrowLime from "../../../images/arrow_lime.svg"
import arrowLimeDimmer from "../../../images/arrow_lime_dimmer.svg"

/*
 Imagine we're looking at a 3m * 3m holographic map like in Avatar
 tho this is on a wall, and it's just a 2D projection instead of a 3D one
 Camera placed on +z axis looking down -z axis, in other words, the xy plane
 the xy plane obviously uses Cartesian coordinates
 */
class StarMapScene extends ThreeJsScene {
    /* I. Member variables */
    // I.1. Static assets
    planeGeometry: PlaneGeometry = new PlaneGeometry(0.175, 0.175);
    lineMaterial = new LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.15
    });
    lineGeometry = new BufferGeometry();

    // I.2. Scene objects
    compass?: Mesh;
    lookDirectionTextUI: CSS2DObject;
    stars = new Map<Body, Star>();
    lineSegments: LineSegments = new LineSegments();
    northLine?: Line;

    // I.3. Marker - are texture loaded and scene is ready?
    isReady = false;

    // I.4. Data
    lookAzimuth = 0; // azimuth, in degrees

    /* II. Functions - Constructor */
    // II.1. Constructor
    constructor(config: SceneConfig, canvasRef: MutableRefObject<HTMLDivElement>, bodies: Body[]) {
        // 0. Set up scene, renderer, camera, lighting
        super(config, canvasRef);

        // 1. Create look direction text label
        this.lookDirectionTextUI = createTextObject(addCardinalToDirectionWithoutTrailingZeros(this.lookAzimuth));
        this.lookDirectionTextUI.center = new Vector2(0.5, 1);
        this.lookDirectionTextUI.position.set(0, 3.1, 0.1);
        this.addObjectToScene(this.lookDirectionTextUI);

        // 2. Add coordinate axes
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

        const axisLineX = new Line(
            new BufferGeometry().setFromPoints([
                new Vector3(-3, 0, 0),
                new Vector3(3, 0, 0)
            ]),
            axisLineMaterial1
        );
        const axisLineYNegative = new Line(
            new BufferGeometry().setFromPoints([
                new Vector3(0, -3, 0),
                new Vector3(0, 0, 0)
            ]),
            axisLineMaterial1
        );
        const axisLineYPositive = new Line(
            new BufferGeometry().setFromPoints([
                new Vector3(0, 0, 0),
                new Vector3(0, 3, 0)
            ]),
            axisLineMaterial2
        );
        const axisLineZ = new Line(
            new BufferGeometry().setFromPoints([
                new Vector3(0, 0, -3),
                new Vector3(0, 0, 3)
            ]),
            axisLineMaterial1
        );
        this.addObjectToScene(axisLineX);
        this.addObjectToScene(axisLineYNegative);
        this.addObjectToScene(axisLineYPositive);
        this.addObjectToScene(axisLineZ);

        // 3. North line
        this.northLine = new Line(
            new BufferGeometry().setFromPoints([
                new Vector3(0, 0, 0),
                new Vector3(0, 2.6, 0)
            ]),
            axisLineMaterial2
        );
        this.addObjectToScene(this.northLine);

        // 4. Zenith text
        const zenithText = createTextObject("Zenith");
        zenithText.element.style.fontWeight = "normal";
        zenithText.element.style.color = "rgba(255, 255, 255, 0.5)";
        zenithText.position.set(0, 0, 3.3);
        this.addObjectToScene(zenithText);

        // 5. Create map widgets
        this.createMapWidgets(bodies)
            .then(() => {
                this.isReady = true;
            })
            .catch((e) => {
                console.log(e);
            });
    }

    // II.5. Camera
    // Imagine we're standing from 5m looking at a 3m * 3m screen/wall
    setUpCamera(): void {
        const distance = 5;
        const viewSize = 5.5;

        this.camera = new OrthographicCamera(
            -viewSize / 2,
            viewSize / 2,
            viewSize / 2,
            -viewSize / 2,
            0.1,
            100
        );

        // Position camera like Unity third-person: above and back
        this.camera.position.set(
            distance, // X
            -distance, // Y
            distance  // Z
        );
        this.camera.up.set(0, 0, 1);
        this.camera.lookAt(0, 0, 0);
    }

    // II.6. Lighting
    addLighting(): void {
        const light = new AmbientLight(0xffffff);
        this.addObjectToScene(light);
    }

    // II.7. Create map widgets
    async createMapWidgets(stars: Body[]): Promise<void> {
        // Load SVGs
        const textureLoader = new TextureLoader();
        try {
            // 0. Wait for all textures to load
            const [compassTexture, triangleTexture, crossTexture, arrowLimeTexture, arrowLimeDimmerTexture] = await Promise.all([
                textureLoader.loadAsync(compass),
                textureLoader.loadAsync(triangle),
                textureLoader.loadAsync(cross),
                textureLoader.loadAsync(arrowLime),
                textureLoader.loadAsync(arrowLimeDimmer)
            ]);

            // 1. Create meshes from the loaded textures
            // 1.1. Compass
            this.compass = new Mesh(
                new PlaneGeometry(6, 6),
                new MeshBasicMaterial({
                    map: compassTexture,
                    transparent: true
                })
            );
            this.addObjectToScene(this.compass);
            this.compass.up.set(0, 0, 1);

            // 1.2. Stars (triangle icons and texts)
            this.initializeStars(triangleTexture, stars);

            // 1.3. Center Cross
            const crossMesh = createPlaneMeshFromSvgTexture(this.planeGeometry, crossTexture);
            this.addObjectToScene(crossMesh);
            crossMesh.position.z = 0.01;
            const you = createTextObject("You");
            this.addObjectToScene(you);
            you.translateX(0.25);

            // 1.4. Forward arrow
            const forwardArrow = new Mesh(
                new PlaneGeometry(0.2, 0.2),
                new MeshBasicMaterial({
                    map: arrowLimeTexture,
                    transparent: true
                })
            );
            this.addObjectToScene(forwardArrow);
            forwardArrow.position.y = 3.1;
            forwardArrow.position.z = 0.01;

            const axisXArrow = new Mesh(
                new PlaneGeometry(0.15, 0.15),
                new MeshBasicMaterial({
                    map: arrowLimeDimmerTexture,
                    transparent: true
                })
            );
            this.addObjectToScene(axisXArrow);
            axisXArrow.position.x = 3.1;
            axisXArrow.position.z = 0.01;
            axisXArrow.rotation.z = -90 * Math.PI / 180;

            const axisZArrow = new Mesh(
                new PlaneGeometry(0.15, 0.15),
                new MeshBasicMaterial({
                    map: arrowLimeDimmerTexture,
                    transparent: true
                })
            );
            this.addObjectToScene(axisZArrow);
            axisZArrow.position.z = 3.1;
            axisZArrow.up.set(0, 0, 1);
            axisZArrow.lookAt(this.camera.position);

            // 2. Render the scene after adding the meshes
            this.render();
        } catch (error) {
            console.error("error loading textures", error);
        }
    }

    // II.8. Create star meshes and texts
    initializeStars(texture: Texture, starNames: Body[]): void {
        for (const starName of starNames) {
            const star = new Star(starName.toString(), this.planeGeometry, texture, this.camera.position);
            this.stars.set(starName, star);
            this.addObjectToScene(star.mesh);
        }
    }

    /* III. Functionalities */
    updateStarPositions(starPositions: Map<Body, StarPosition>): void {
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
            this.stars.get(body)?.updatePolarCoordinate(distance, starPositions.get(body)!.az, starPositions.get(body)!.alt);
        }

        // Update stars (mesh and text)
        this.updateStarsOnMap();
    }

    updateLookDirection(direction: number): void {
        if (!this.isReady) {
            return;
        }

        this.lookAzimuth = direction;
        // Rotate compass
        this.compass!.rotation.z = direction * Math.PI / 180;
        // Update look direction text
        this.lookDirectionTextUI.element.textContent = addCardinalToDirectionWithoutTrailingZeros(direction);
        // Rotate north line
        this.northLine!.rotation.z = direction * Math.PI / 180;

        // Update star objects
        this.updateStarsOnMap();
    }

    // Update star objects, specifically, positions on map
    updateStarsOnMap(): void {
        if (!this.isReady) {
            return;
        }

        const projectionPoints: number[] = [];
        for (const [, star] of this.stars) {
            star.render(this.lookAzimuth, projectionPoints);
        }

        this.removeObjectFromScene(this.lineSegments);
        this.lineGeometry.setAttribute('position', new Float32BufferAttribute(projectionPoints, 3));
        this.lineSegments = new LineSegments(this.lineGeometry, this.lineMaterial);
        this.addObjectToScene(this.lineSegments);

        this.render();
    }
}

export default StarMapScene;
