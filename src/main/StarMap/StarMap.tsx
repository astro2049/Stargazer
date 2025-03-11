import { MutableRefObject, useEffect, useRef } from "react";
import { StarPosition } from "../Main.tsx";
import { Body } from "astronomy-engine";
import StarMapScene from "./StarMapScene.ts";
import { bodies } from "../constants.ts";
// import Compass from "../../components/Compass/Compass.tsx";

type Props = {
    lookDirection: number, // in degrees
    starPositions: Map<Body, StarPosition>
};

function StarMap(
    {
        lookDirection,
        starPositions
    }: Props) {
    const canvasRef = useRef<HTMLDivElement | null>(null);
    const starMapSceneRef = useRef<StarMapScene | null>(null);

    useEffect(() => {
        if (!canvasRef.current) {
            return;
        }

        // Initialize star map scene
        starMapSceneRef.current = new StarMapScene(
            { width: 800, height: 800 },
            canvasRef as MutableRefObject<HTMLDivElement>,
            bodies
        );

        // Cleanup
        return () => starMapSceneRef.current!.cleanup();
    }, []);

    useEffect(() => {
        starMapSceneRef.current?.setStarPositions(starPositions);
    }, [starPositions]);

    useEffect(() => {
        starMapSceneRef.current?.updateLookDirection(lookDirection);
    }, [lookDirection]);

    return (
        <div className="box" style={{ paddingBottom: 0 }}>
            <h1 className="text-2xl">Star Map</h1>
            <div ref={canvasRef} className="relative flex justify-center overflow-hidden"></div>
            {/*<Compass/>*/}
        </div>
    );
}

export default StarMap;
