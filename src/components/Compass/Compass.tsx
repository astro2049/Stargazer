import { TextStyle } from 'pixi.js';
import { Graphics as PixiGraphics } from '@pixi/graphics';
import { Stage, Container, Sprite, Text, Graphics } from '@pixi/react';
import redArrow from "../../images/red-arrow.svg";
// import cross from "../../images/lime-cross-rotated.svg";
import { starMapConfig } from "../../main/constants.ts";

/* Constants */
const radius = 350;
const lineColor = 0xffffff;
const textStyle = new TextStyle({
    fontFamily: ["Consolas", "monospace"],
    align: "left",
    fill: 0xffffff,
    fontSize: 20,
    fontWeight: "bold"
});
const referenceDirections = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];

/* Functions */
function draw(g: PixiGraphics): void {
    g.clear();
    g.position.set(starMapConfig.width / 2, starMapConfig.height / 2);

    // 0. Draw circle
    // g.lineStyle(2, lineColor, 0.5);
    // g.drawCircle(0, 0, radius - 25);
    // g.drawCircle(0, 0, radius);

    // 1. Draw forward
    // g.lineStyle(2, lineColor, 0.5);
    // g.moveTo(0, -radius - 50);
    // g.lineTo(0, -radius);

    // 2. Draw tick marks
    g.lineStyle(2, lineColor, 0.5);

    for (let offset = 0; offset < 360; offset += 3) {
        let start = radius - 15;

        if (offset % 90 === 0) {
            start -= 75;
        } else if (offset % 45 === 0) {
            start -= 50;
        } else {
            start -= 25;
        }

        const startCoords = polarToCanvasCoordinates(start, offset);
        const endCoords = polarToCanvasCoordinates(radius, offset);
        g.moveTo(startCoords.x, startCoords.y);
        g.lineTo(endCoords.x, endCoords.y);
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
    let offset = 0;

    return (
        <Stage width={starMapConfig.width} height={starMapConfig.height}
               options={{ backgroundAlpha: 0, antialias: true }}>
            {/* 1. Tick Marks */}
            <Graphics draw={draw}/>
            <Container x={starMapConfig.width / 2} y={starMapConfig.height / 2}>
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
                    y={-radius - 20}
                />

                {/* 3. Reference directions */}
                {
                    referenceDirections.map((direction: string) => {
                        const angle = offset;
                        const coordinate = polarToCanvasCoordinates(radius, offset);
                        offset += 45;
                        return (
                            <Text
                                key={direction}
                                text={direction}
                                anchor={[0.5, 1]}
                                x={coordinate.x}
                                y={coordinate.y}
                                angle={angle}
                                style={textStyle}
                            />
                        )
                    })
                }
            </Container>
        </Stage>
    );
}

export default Compass;
