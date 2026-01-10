import { Body } from "astronomy-engine";

/* Const variables */
const Const_Bodies = [
    Body.Sun,
    Body.Moon,
    Body.Mercury,
    Body.Venus,
    Body.Mars,
    Body.Jupiter,
    Body.Saturn,
    Body.Uranus,
    Body.Neptune,
];

const Const_StarMapSceneCanvasSize = {
    width: 720,
    height: 720,
}

// camera
const Const_CameraDistance = 5;
const Const_CameraViewSize = 5.5;

// scene
const Const_MapRadius = 3;

export {
    Const_Bodies,
    Const_StarMapSceneCanvasSize,
    Const_CameraDistance,
    Const_CameraViewSize,
    Const_MapRadius
};
