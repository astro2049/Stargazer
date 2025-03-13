import { Body } from "astronomy-engine";
import { StarPosition } from "../Main.tsx";

type Props = {
    starPositions: Map<Body, StarPosition>
};

function StarsTable({ starPositions }: Props) {
    return (
        <div>
            <div className="w-full flex items-center gap-x-1">
                <div className="w-2 h-[1px] bg-sector-divider"></div>
                <h2>Celestial Body Positions</h2>
                <div className="grow h-[1px] bg-sector-divider"></div>
            </div>
            <div className="pb-1 px-1 flex justify-center">
                <table className="mb-1 w-[720px]">
                    <thead>
                    <tr className="text-left text-stone-300 border-b border-neutral-600">
                        <th className="w-1/6">Body</th>
                        <th className="w-1/6">Right Ascension<br/>(RA, h)</th>
                        <th className="w-1/6">Declination<br/>(DEC, °)</th>
                        <th className="w-1/6">Azimuth<br/>(Az, °)</th>
                        <th className="w-1/6">Altitude Angle<br/>(Alt, °)</th>
                        <th className="w-1/6">Distance<br/>(Dis, AU)</th>
                    </tr>
                    </thead>
                    <tbody>
                    {[...starPositions].map(
                        ([body, positionInfo]) => {
                            return (
                                <tr key={body} className="border-b border-neutral-600">
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
