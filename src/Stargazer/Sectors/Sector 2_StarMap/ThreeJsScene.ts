import { MutableRefObject } from "react";
import { Camera, Color, Object3D, Scene, WebGLRenderer } from "three";
// import { AxesHelper } from "three";
import { CSS2DRenderer } from "three/examples/jsm/Addons.js";

export type SceneConfig = {
    width: number,
    height: number,
};

abstract class ThreeJsScene {
    /* I. Member Variables */
    // canvas
    canvasRef: MutableRefObject<HTMLDivElement>;
    private scene!: Scene;

    private renderer!: WebGLRenderer;
    private css2DRenderer!: CSS2DRenderer;

    camera!: Camera;

    /* II. Functions - Constructor */
    // II.1. Constructor
    protected constructor(config: SceneConfig, canvasRef: MutableRefObject<HTMLDivElement>) {
        this.canvasRef = canvasRef;

        // II.2. Scene, Renderer
        this.setUpScene(config);

        // II.3. Set up 2D renderer, for texts
        this.setUpTextRenderer(config);

        // II.5., II.6. Camera and Lighting
        this.setUpCamera();
        this.addLighting();

        // (Debug) Draw axis lines / Red: X-axis, Green: Y-axis, Blue: Z-axis
        // const axesHelper = new AxesHelper(2); // size = 2 units
        // this.scene.add(axesHelper);
    }

    // II.2. Scene, Renderer
    private setUpScene(config: SceneConfig): void {
        // 0. Scene
        this.scene = new Scene();
        // background color: #171717
        this.scene.background = new Color(0x171717);

        // 1. Renderer
        this.renderer = new WebGLRenderer({
            antialias: true
        });
        this.renderer.setSize(config.width, config.height);
        this.canvasRef.current.appendChild(this.renderer.domElement);
    }

    // II.3. Set up 2D renderer, for texts
    private setUpTextRenderer(config: SceneConfig) {
        // https://threejs.org/docs/#examples/en/renderers/CSS2DRenderer
        this.css2DRenderer = new CSS2DRenderer();
        this.css2DRenderer.setSize(config.width, config.height);
        this.css2DRenderer.domElement.style.position = 'absolute';
        this.canvasRef.current.appendChild(this.css2DRenderer.domElement);
    }

    // II.4. cleanup function
    cleanup(): void {
        this.canvasRef.current.removeChild(this.renderer.domElement);
        this.canvasRef.current.removeChild(this.css2DRenderer.domElement);
        this.renderer.dispose();
    }

    // II.5. Camera
    protected abstract setUpCamera(): void;

    // II.6. Lighting
    protected abstract addLighting(): void;

    /* III. Functionalities */
    // III.1. Render
    protected render(): void {
        this.renderer.render(this.scene, this.camera);
        this.css2DRenderer.render(this.scene, this.camera);
    }

    // III.2. Add object to scene
    // (however, they are really added to the z-axis up group)
    protected addObjectToScene(object: Object3D): void {
        this.scene.add(object);
    }

    // III.3. Remove object from scene
    protected removeObjectFromScene(object: Object3D): void {
        this.scene.remove(object);
    }
}

export default ThreeJsScene;
