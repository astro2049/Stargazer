import { useEffect, useState } from "react";

type WindowWidthProps = {
    className?: string
}

function WindowWidth({
                         className
                     }: WindowWidthProps) {
    const [width, setWidth] = useState(window.innerWidth);

    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className={className}>
            Width: {width}px
        </div>
    );
}

export default WindowWidth;
