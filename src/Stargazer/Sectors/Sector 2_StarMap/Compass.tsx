import { TextStyle } from 'pixi.js';
import { Graphics as PixiGraphics } from '@pixi/graphics';
import { Stage, Container, Sprite, Text, Graphics } from '@pixi/react';
import redArrow from "../../../images/arrow_red.svg";
import { GetCardinalText } from "./Utilities.ts";
// import cross from "../../images/lime-cross-rotated.svg";

/* Constants */
const canvasSize = {
    width: 800,
    height: 800
};
const radius = 350;
const lineColor = 0xffffff;
const textStyle = new TextStyle({
    fontFamily: ["Consolas", "monospace"],
    align: "left",
    fill: 0xffffff,
    fontSize: 16,
    fontWeight: "bold"
});

/* Functions */
function draw(g: PixiGraphics): void {
    g.clear();
    g.position.set(canvasSize.width / 2, canvasSize.height / 2);

    // 0. Draw circle
    g.lineStyle(2, lineColor, 0.5);
    g.drawCircle(0, 0, radius - 45);
    // g.drawCircle(0, 0, radius);

    // 1. Draw forward
    // g.lineStyle(2, lineColor, 0.5);
    // g.moveTo(0, -radius - 50);
    // g.lineTo(0, -radius);

    // 2. Draw tick marks
    g.lineStyle(1, lineColor, 0.5);

    for (let angle = 0; angle < 360; angle += 15) {
        const start = radius - 50;
        const end = getRadius(angle);
        const startCoords = polarToCanvasCoordinates(start, angle);
        const endCoords = polarToCanvasCoordinates(end, angle);
        g.moveTo(startCoords.x, startCoords.y);
        g.lineTo(endCoords.x, endCoords.y);
    }
}

function getDirectionTextAndCardinal() {
    const elements = [];
    for (let angle = 0; angle < 360; angle += 45) {
        const distance = getRadius(angle) + 5;
        const coordinate = polarToCanvasCoordinates(distance, angle);
        elements.push(
            <Text
                key={angle}
                text={angle === 0 ? "N" : `${angle}° ${GetCardinalText(angle)}`}
                anchor={[0.5, 1]}
                x={coordinate.x}
                y={coordinate.y}
                angle={angle}
                style={textStyle}
            />
        );
    }
    return elements;
}

function getRadius(anOffset: number): number {
    if (anOffset % 90 === 0) {
        return radius - 5;
    } else if (anOffset % 45 === 0) {
        return radius - 20;
    } else {
        return radius - 35;
    }
}

function polarToCanvasCoordinates(radius: number, angle: number): {x: number, y: number} {
    const angleRad = angle * Math.PI / 180;
    return {
        x: radius * Math.sin(angleRad),
        y: radius * -Math.cos(angleRad)
    }
}

// Just for exporting the compass image
function Compass() {
    return (
        <Stage width={canvasSize.width} height={canvasSize.height}
               options={{ backgroundAlpha: 0, antialias: true }}>
            {/* 1. Tick Marks */}
            <Graphics draw={draw}/>
            <Container x={canvasSize.width / 2} y={canvasSize.height / 2}>
                {/* Center Cross */}
                {/*<Sprite*/}
                {/*    image={cross}*/}
                {/*    anchor={[0.5, 0.5]}*/}
                {/*    scale={0.75}*/}
                {/*/>*/}
                {/*<Text*/}
                {/*    text="You"*/}
                {/*    anchor={[0, 0.5]}*/}
                {/*    x={17.5}*/}
                {/*    y={0}*/}
                {/*    style={textStyle}*/}
                {/*/>*/}

                {/* 2. Arrow: North */}
                <Sprite
                    image={redArrow}
                    anchor={[0.5, 1]}
                    x={0}
                    y={-radius - 17.5}
                />

                {/* 3. Reference directions */}
                {getDirectionTextAndCardinal()}
            </Container>
        </Stage>
    );
}

export default Compass;
