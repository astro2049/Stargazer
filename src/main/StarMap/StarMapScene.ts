import {
    AmbientLight,
    BufferGeometry, Color,
    Line,
    LineBasicMaterial,
    Mesh, MeshBasicMaterial, OrthographicCamera,
    PlaneGeometry, Texture,
    TextureLoader,
    Vector2,
    Vector3
} from "three";
import ThreeJsScene, { SceneConfig } from "../ThreeJsScene.ts";
import triangle from "../../images/orange-triangle.svg";
import cross from "../../images/lime-cross-rotated.svg";
import { MutableRefObject } from "react";
import { Body } from "astronomy-engine";
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/Addons.js";
import { StarPosition } from "../Main.tsx";
import compass from "../../images/compass.png"

type StarObject = {
    mesh: Mesh,
    text: HTMLDivElement
}

type PolarCoordinate = {
    radius: number,
    angle: number // in degrees
}

/*
 Imagine we're looking at a 3m * 3m holographic map like in Avatar
 tho this is on a wall, and it's just a 2D projection instead of a 3D one
 Camera placed on +z axis looking down -z axis, in other words, the xy plane
 the xy plane obviously uses Cartesian coordinates
 */
class StarMapScene extends ThreeJsScene {
    /* I. Member variables */
    // I.A Scene
    css2DRenderer: CSS2DRenderer;

    // I.B. Static assets
    planeGeometry: PlaneGeometry = new PlaneGeometry(0.175, 0.175);

    // I.C. Scene objects
    compass?: Mesh;
    lookDirectionTextUI: CSS2DObject;
    stars?: Map<Body, StarObject>;

    // I.D. Marker - are texture loaded and scene is ready?
    isReady = false;

    // I.E. Data
    lookAzimuth = 0; // azimuth, in degrees
    starCoordinates: Map<Body, PolarCoordinate> = new Map<Body, PolarCoordinate>();

    /* II. Functions - Constructor */
    // II.A. Constructor
    constructor(config: SceneConfig, canvasRef: MutableRefObject<HTMLDivElement>, bodies: Body[]) {
        // 0. Set up scene, renderer, camera, lighting
        super(config, canvasRef);

        // 1. Scene - background color: #f3f3f3
        this.scene.background = new Color(0x171717);

        // 2. Set up 2D renderer, for texts
        // https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer
        this.css2DRenderer = new CSS2DRenderer();
        this.css2DRenderer.setSize(config.width, config.height);
        this.css2DRenderer.domElement.style.position = 'absolute';
        this.canvasRef.current.appendChild(this.css2DRenderer.domElement);

        // 3. Look direction
        // 3.1. Create text label
        this.lookDirectionTextUI = this.createTextObject(this.addCardinalToDirectionWithoutTrailingZeros(this.lookAzimuth));
        this.lookDirectionTextUI.center = new Vector2(0.5, 1);
        this.lookDirectionTextUI.position.set(0, 3, 0);
        this.scene.add(this.lookDirectionTextUI);
        // 3.2. Add look direction line
        const line = new Line(
            new BufferGeometry().setFromPoints([
                new Vector3(0, 0, 0),
                new Vector3(0, 1.125, 0)
            ]),
            new LineBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.5
            })
        );
        line.translateY(1.95);
        this.scene.add(line);

        // 4. Create map widgets
        this.createMapWidgets(bodies)
            .then(() => {
                this.isReady = true;
            })
            .catch((e) => {
                console.log(e);
            });
    }

    // II.C. cleanup function
    cleanup(): void {
        super.cleanup();

        this.canvasRef.current.removeChild(this.css2DRenderer.domElement);
    }

    // II.D. Camera
    setUpCamera(): void {
        // Imagine we're standing from 5m looking at a 3m * 3m screen/wall
        const distance = 3.2;
        this.camera = new OrthographicCamera(-distance, distance, distance, -distance, 0.1, distance + 0.1);
        this.camera.position.z = distance;
    }

    // II.E. Lighting
    addLighting(): void {
        const light = new AmbientLight(0xffffff);
        this.scene.add(light);
    }

    // II.F. Create map widgets
    async createMapWidgets(stars: Body[]): Promise<void> {
        // Load SVGs
        const textureLoader = new TextureLoader();
        try {
            // 0. Wait for all textures to load
            const [compassTexture, triangleTexture, crossTexture] = await Promise.all([
                textureLoader.loadAsync(compass),
                textureLoader.loadAsync(triangle),
                textureLoader.loadAsync(cross),
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
            this.scene.add(this.compass);

            // 1.2. Stars (triangle icons and texts)
            this.initializeStars(triangleTexture, stars);

            // 1.3. Center Cross
            this.scene.add(this.createPlaneMeshFromSvgTexture(crossTexture));
            const you = this.createTextObject("You");
            this.scene.add(you);
            you.translateX(0.25);

            // 1.4. Render the scene after adding the meshes
            this.render();
        } catch (error) {
            console.error("error loading textures", error);
        }
    }

    // II.G. Create star meshes and texts
    initializeStars(texture: Texture, stars: Body[]): void {
        this.stars = new Map<Body, StarObject>();

        for (const star of stars) {
            const mesh = this.createPlaneMeshFromSvgTexture(texture);

            const container = document.createElement("div");
            container.style.fontSize = "14px";
            const azimuth = document.createElement("div");
            azimuth.style.lineHeight = "normal";
            container.appendChild(azimuth);
            const name = document.createElement("div");
            name.style.fontWeight = "bold";
            name.style.lineHeight = "normal";
            name.textContent = star.toString();
            container.appendChild(name);

            const containerObject = new CSS2DObject(container);
            containerObject.center = new Vector2(0, 0.5);
            mesh.add(containerObject);
            containerObject.translateX(0.175);

            this.stars.set(star, {
                mesh: mesh,
                text: azimuth
            });
            this.scene.add(mesh);
        }
    }

    /* III. Functionalities */
    updateLookDirection(direction: number): void {
        if (!this.isReady) {
            return;
        }

        this.lookAzimuth = direction;

        // Rotate compass
        this.compass!.rotation.z = direction * Math.PI / 180;

        // Update look direction text
        this.lookDirectionTextUI.element.textContent = this.addCardinalToDirectionWithoutTrailingZeros(direction);

        // Update star objects
        this.updateStars();
    }

    setStarPositions(starPositions: Map<Body, StarPosition>): void {
        // 1. Figure out the stars' orbits on map
        const entries = [...starPositions];
        entries.sort(([, posA], [, posB]) => {
            return posA.dist - posB.dist;
        });

        // 2. Update the stars' coordinates on map
        for (let i = 0; i < entries.length; i++) {
            const [body] = entries[i];
            const distance = (i + 1.5) * 0.225;
            this.starCoordinates.set(body, {
                radius: distance,
                angle: starPositions.get(body)!.az
            });
        }

        // Update star azimuth texts
        this.updateStarAzimuthTexts();

        // Update star objects
        this.updateStars();
    }

    updateStarAzimuthTexts() {
        if (!this.isReady) {
            return;
        }

        for (const [body, starObject] of this.stars!) {
            starObject.text.innerText = this.addCardinalToDirection(this.starCoordinates.get(body)!.angle);
        }
    }

    // Update star objects, specifically, positions on map
    updateStars(): void {
        if (!this.isReady) {
            return;
        }

        for (const [body, star] of this.stars!) {
            const coordinate = this.starCoordinates.get(body)!;
            const { x, y } = this.polarToCartesianCoordinates({
                radius: coordinate.radius,
                angle: coordinate.angle - this.lookAzimuth
            });
            star.mesh.position.set(x, y, 0);
        }

        this.render();
    }

    render(): void {
        super.render();

        this.css2DRenderer.render(this.scene, this.camera);
    }

    /* IV. Helper functions */
    polarToCartesianCoordinates(coordinate: PolarCoordinate): {x: number, y: number} {
        const angleRad = (-coordinate.angle + 90) * Math.PI / 180;
        return {
            x: coordinate.radius * Math.cos(angleRad),
            y: coordinate.radius * Math.sin(angleRad)
        }
    }

    referenceDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

    addCardinalToDirectionWithoutTrailingZeros(degrees: number): string {
        const index = Math.round(degrees / 45) % 8;

        return `${parseFloat(degrees.toFixed(2))}° ${this.referenceDirections[index]}`;
    }

    addCardinalToDirection(degrees: number): string {
        const index = Math.round(degrees / 45) % 8;

        return `${degrees.toFixed(2)}° ${this.referenceDirections[index]}`;
    }

    /* V. Utilities */
    createPlaneMeshFromSvgTexture(texture: Texture): Mesh {
        return new Mesh(this.planeGeometry, new MeshBasicMaterial({
            map: texture,
            transparent: true
        }));
    }

    createTextObject(text: string): CSS2DObject {
        const textDiv = document.createElement("div");
        textDiv.style.fontSize = "14px";
        textDiv.style.fontWeight = "bold";
        textDiv.innerText = text;
        return new CSS2DObject(textDiv);
    }
}

export default StarMapScene;
