import './StarsTable.css'
import { Body } from "astronomy-engine";
import { StarPosition } from "../Main.tsx";

type Props = {
    starPositions: Map<Body, StarPosition>
};

function StarsTable({ starPositions }: Props) {
    return (
        <div className="box">
            <h1 className="text-2xl mb-1">Celestial Body Positions</h1>
            <div className="flex justify-center">
                <table className="w-[900px]">
                    <thead>
                    <tr className="text-left">
                        <th className="w-1/6">Body</th>
                        <th className="w-1/6">Right Ascension (RA, h)</th>
                        <th className="w-1/6">Declination (DEC, °)</th>
                        <th className="w-1/6">Azimuth (Az, °)</th>
                        <th className="w-1/6">Altitude Angle (Alt, °)</th>
                        <th className="w-1/6">Distance (Dis, AU)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {[...starPositions].map(
                        ([body, positionInfo]) => {
                            return (
                                <tr key={body} className="border-t border-gray-600">
                                    <td className="font-medium">{body}</td>
                                    <td>{positionInfo.ra.toFixed(2)}</td>
                                    <td>{positionInfo.dec.toFixed(2)}</td>
                                    <td>{positionInfo.az.toFixed(2)}</td>
                                    <td>{positionInfo.alt.toFixed(2)}</td>
                                    <td>{positionInfo.dist.toFixed(2)}</td>
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

export default StarsTable;
