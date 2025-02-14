import { MutableRefObject } from "react";
import { Camera, Scene, WebGLRenderer } from "three";

export type SceneConfig = {
    width: number,
    height: number,
};

abstract class ThreeJsScene {
    /* I. Member Variables */
    canvasRef: MutableRefObject<HTMLDivElement>;
    scene!: Scene;
    renderer!: WebGLRenderer;
    camera!: Camera;

    /* II. Functions - Constructor */
    // II.A. Constructor
    protected constructor(config: SceneConfig, canvasRef: MutableRefObject<HTMLDivElement>) {
        this.canvasRef = canvasRef;

        // II.B. Scene, Renderer
        this.setUpScene(config);

        // II.D., II.E. Camera and Lighting
        this.setUpCamera();
        this.addLighting();
    }

    // II.B. Scene, Renderer
    setUpScene(config: SceneConfig): void {
        // 0. Scene
        this.scene = new Scene();

        // 1. Renderer
        this.renderer = new WebGLRenderer({
            antialias: true
        });
        this.renderer.setSize(config.width, config.height);
        this.canvasRef.current.appendChild(this.renderer.domElement);
    }

    // II.C. cleanup function
    cleanup(): void {
        this.canvasRef.current.removeChild(this.renderer.domElement);
        this.renderer.dispose();
    }

    // II.D. Camera
    abstract setUpCamera(): void;

    // II.E. Lighting
    abstract addLighting(): void;

    /* III. Functionalities */
    render(): void {
        this.renderer.render(this.scene, this.camera);
    }
}

export default ThreeJsScene;
