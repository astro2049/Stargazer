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
            { width: 640, height: 640 },
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
        <div>
            <div className="mx-2">
                <div className="flex items-center gap-x-1">
                    <div className="w-1 h-[1px] bg-sector-divider"></div>
                    <h2>🏜️ Star Map</h2>
                    <div className="grow h-[1px] bg-sector-divider"></div>
                </div>
                <div ref={canvasRef} className="mt-1 relative flex justify-center overflow-hidden"></div>
            </div>

            {/*<Compass/>*/}
        </div>
    );
}

export default StarMap;
