import { Body } from "astronomy-engine";
import { StarPosition } from "../../Main.tsx";
import { GetDirectionAndCardinalText } from "../Sector 2_StarMap/Utilities.ts";

type Props = {
    starPositions: Map<Body, StarPosition>
};

function Sector3_StarLocations({ starPositions }: Props) {
    return (
        <div className="mx-2">
            <div className="flex items-center gap-x-1">
                <div className="w-1 h-[1px] bg-sector-divider"></div>
                <h2>🪐 Celestial Body Positions</h2>
                <div className="grow h-[1px] bg-sector-divider"></div>
            </div>
            <div className="pb-1 px-1 flex justify-center">
                <table className="mb-1 w-[720px]">
                    <thead>
                    <tr className="text-left text-stone-300 border-b border-neutral-700">
                        <th className="w-1/6">Body</th>
                        <th className="w-1/6">Right Ascension</th>
                        <th className="w-1/6">Declination</th>
                        <th className="w-1/6">Azimuth</th>
                        <th className="w-1/6">Altitude Angle</th>
                        <th className="w-1/6">Distance</th>
                    </tr>
                    </thead>
                    <tbody>
                    {[...starPositions].map(
                        ([body, positionInfo]) => {
                            return (
                                <tr key={body} className="border-b border-neutral-700">
                                    <td className="font-medium">{body}</td>
                                    <td>{positionInfo.ra.toFixed(1)}h</td>
                                    <td>{`${positionInfo.dec > 0 ? "+" : ""}${positionInfo.dec.toFixed(1)}°`}</td>
                                    <td>{GetDirectionAndCardinalText(positionInfo.az, true)}</td>
                                    <td>{`${positionInfo.alt > 0 ? "+" : ""}${positionInfo.alt.toFixed(1)}°`}</td>
                                    <td>{positionInfo.dist.toFixed(1)} AU</td>
                                </tr>
                            );
                        }
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default Sector3_StarLocations;
