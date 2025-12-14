import { ObserverDetails } from "../../Main.tsx";
import LabeledInput from "./LabeledInput.tsx";

type Props = {
    observer: ObserverDetails,
    setObserver: (observer: ObserverDetails) => void,
    date: Date,
    lookDirection: number,
    setLookDirection: (lookDirection: number) => void
};

function Sector1_Observer({
                          observer,
                          setObserver,
                          date,
                          lookDirection,
                          setLookDirection,
                      }: Props) {
    return (
        <div className="mx-2">
            <div className="flex items-center gap-x-1">
                <div className="w-1 h-[1px] bg-sector-divider"></div>
                <h2>🗿 Observer</h2>
                <div className="grow h-[1px] bg-sector-divider"></div>
            </div>
            <div className="w-full flex justify-center">
                <div className="w-[720px] py-0.5 flex">
                    <div className="w-[calc(50%-1.5rem)]">
                        <div className="flex items-center gap-x-0.5">
                            <div className="w-1 h-[1px] bg-stone-800"></div>
                            <div className="text-stone-400 font-semibold">
                                Date and time
                            </div>
                            <div className="grow h-[1px] bg-stone-800"></div>
                        </div>
                        <div className="pl-1.5">
                            {date.toUTCString()}
                        </div>
                    </div>

                    <div className="grow">
                        <div className="relative flex items-center gap-x-0.5">
                            <div className="w-1 h-[1px] bg-stone-800"></div>
                            <div className="text-stone-400 font-semibold">
                                Location
                            </div>
                            <div className="grow h-[1px] bg-stone-800"></div>
                            <div className="absolute top-0.75 w-[1px] h-[85px] bg-stone-800"></div>
                        </div>
                        <div className="pl-1.5 pb-1 flex gap-x-1">
                            <div className="flex">
                                <LabeledInput
                                    label="Latitude"
                                    type="number"
                                    value={observer.latitude}
                                    decimalPlaces={2}
                                    setStateValue={(x: number) => {
                                        setObserver({
                                            ...observer,
                                            latitude: x
                                        });
                                    }}
                                    min={-90}
                                    max={90}
                                    errorMessage={"Please enter a value between -90 and 90."}
                                />
                                °
                            </div>
                            <div className="flex">
                                <LabeledInput
                                    label="Longitude"
                                    type="number"
                                    value={observer.longitude}
                                    decimalPlaces={2}
                                    setStateValue={(x: number) => {
                                        setObserver({
                                            ...observer,
                                            longitude: x
                                        });
                                    }}
                                    min={-180}
                                    max={180}
                                    errorMessage={"Please enter a value between -180 and 180."}
                                />
                                °
                            </div>
                            <div className="flex">
                                <LabeledInput
                                    label="Elevation"
                                    type="number"
                                    value={observer.elevation}
                                    setStateValue={(x: number): void => {
                                        setObserver({
                                            ...observer,
                                            elevation: x
                                        });
                                    }}
                                    min={0}
                                    errorMessage={"Please enter a value >= 0"}
                                />
                                m
                            </div>
                        </div>
                        <div className="flex items-center gap-x-0.5">
                            <div className="w-1 h-[1px] bg-stone-800"></div>
                            <div className="text-stone-400 font-semibold">
                                Look direction
                            </div>
                            <div className="grow h-[1px] bg-stone-800"></div>
                        </div>
                        <div className="pl-1.5">
                            <div className="flex">
                                <LabeledInput
                                    type="number"
                                    value={lookDirection}
                                    decimalPlaces={2}
                                    setStateValue={(x: number): void => {
                                        setLookDirection(x);
                                    }}
                                />
                                °
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Sector1_Observer;
