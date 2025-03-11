import { Body, Equator, Horizon, Observer } from "astronomy-engine";
import ObserverForm from "./ObserverForm/ObserverForm.tsx";
import { useEffect, useRef, useState } from "react";
import StarMap from "./StarMap/StarMap.tsx";
import Divider from "../components/Divider/Divider.tsx";
import StarsTable from "./StarsTable/StarsTable.tsx";
import { bodies } from "./constants.ts";

/* Types */
export type ObserverDetails = {
    latitude: number,
    longitude: number,
    elevation: number
};

export type StarPosition = {
    ra: number,
    dec: number,
    dist: number,
    az: number,
    alt: number
};

/*  Functions */
// Calculate star positions
// Astronomy Engine (JavaScript / TypeScript):
// API Reference https://github.com/cosinekitty/astronomy/tree/master/source/js
// JavaScript examples for the browser: https://github.com/cosinekitty/astronomy/tree/master/demo/browser
function calculateStarPositions(date: Date, observer: Observer): Map<Body, StarPosition> {
    const starPositions = new Map<Body, StarPosition>();
    bodies.forEach(body => {
        const eqaCoordsJ2000 = Equator(body, date, observer, false, true);
        const eqaCoordsOfDate = Equator(body, date, observer, true, true);
        const hor = Horizon(date, observer, eqaCoordsOfDate.ra, eqaCoordsOfDate.dec, "normal");
        starPositions.set(body, {
            ra: eqaCoordsJ2000.ra,
            dec: eqaCoordsJ2000.dec,
            dist: eqaCoordsJ2000.dist,
            az: hor.azimuth,
            alt: hor.altitude,
        });
    });

    return starPositions;
}

function Main() {
    /* I. States */
    // I.A. Observer
    // I.A.1. latitude, longitude, elevation
    const [observerDetails, setObserverDetails] = useState<ObserverDetails>({
        latitude: 0,
        longitude: 0,
        elevation: 0
    });
    const [observer, setObserver] = useState<Observer>(new Observer(
        observerDetails.latitude,
        observerDetails.longitude,
        observerDetails.elevation
    ));
    // I.A.2. date
    const [date, setDate] = useState<Date>(new Date());
    // I.A.3. look direction
    const [lookDirection, setLookDirection] = useState<number>(0);
    const [compassLookDirection, setCompassLookDirection] = useState<number>(0);

    // I.B. Star positions
    const [starPositions, setStarPositions] = useState<Map<Body, StarPosition>>(new Map<Body, StarPosition>());

    /* II. Use Effects */
    // II.A.1 Refresh star (planet) positions every one second
    // II.A.2 Ask user location, if willing to share
    // TODO: There might be a better way to do this...?
    const observerDetailsRef = useRef<ObserverDetails>();
    observerDetailsRef.current = observerDetails;
    useEffect(() => {
        // II.A.1
        const interval = setInterval(() => {
            setDate(new Date());
        }, 1000);

        // II.A.2
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
                setObserverDetails({
                    latitude: parseFloat(position.coords.latitude.toFixed(2)),
                    longitude: parseFloat(position.coords.longitude.toFixed(2)),
                    elevation: observerDetailsRef.current!.elevation
                });
            });
        }

        // II.A.1
        return () => clearInterval(interval);
    }, []);

    // II.B. Update observer when observer form is updated
    useEffect(() => {
        setObserver(new Observer(observerDetails.latitude, observerDetails.longitude, observerDetails.elevation));
    }, [observerDetails]);

    // II.C. Update star (planet) positions when date or observer is updated
    useEffect(() => {
        setStarPositions(calculateStarPositions(date, observer));
    }, [date, observer]);

    // II.D. Update compass look direction, ranging [0, 360)
    useEffect(() => {
        setCompassLookDirection(((lookDirection % 360) + 360) % 360);
    }, [lookDirection]);

    return (
        <main>
            <ObserverForm observer={observerDetails} setObserver={setObserverDetails} date={date}
                          lookDirection={lookDirection} setLookDirection={setLookDirection}/>
            <Divider/>
            <StarMap lookDirection={compassLookDirection} starPositions={starPositions}/>
            <Divider/>
            <StarsTable starPositions={starPositions}/>
        </main>
    );
}

export default Main;
