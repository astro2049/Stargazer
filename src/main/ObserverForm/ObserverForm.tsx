import { ObserverDetails } from "../Main.tsx";
import LabeledInput from "./LabeledInput";

type Props = {
    observer: ObserverDetails,
    setObserver: (observer: ObserverDetails) => void,
    date: Date,
    lookDirection: number,
    setLookDirection: (lookDirection: number) => void
};

function ObserverForm({
                          observer,
                          setObserver,
                          date,
                          lookDirection,
                          setLookDirection,
                      }: Props) {
    return (
        <div className="box max-w-[800px]">
            <h2 className="mb-1 text-2xl">Observer</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-x-1">
                <LabeledInput
                    label="Date and time:"
                    type="datetime-local"
                    value={date.toISOString().slice(0, 19)}
                    readOnly={true}
                />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-1">
                <LabeledInput
                    label="Latitude (°):"
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
                <LabeledInput
                    label="Longitude (°):"
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
                <LabeledInput
                    label="Elevation (m):"
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
                <LabeledInput
                    label="Look direction (°):"
                    type="number"
                    value={lookDirection}
                    decimalPlaces={2}
                    setStateValue={(x: number): void => {
                        setLookDirection(x);
                    }}
                />
            </div>
        </div>
    );
}

export default ObserverForm;
