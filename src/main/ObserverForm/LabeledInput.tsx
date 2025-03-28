import React, { useCallback, useEffect, useState } from "react";

type LabeledInputProps = {
    label?: string,
    type: string,
    value: string | number,
    decimalPlaces?: number,
    setStateValue?: (x: number) => void,
    readOnly?: boolean,
    min?: number,
    max?: number,
    errorMessage?: string
};

function truncateDecimal(x: number, places: number): number {
    return parseFloat(x.toFixed(places));
}

function LabeledInput({
                          label,
                          type,
                          value,
                          decimalPlaces = 0,
                          setStateValue,
                          readOnly = false,
                          min,
                          max,
                          errorMessage
                      }: LabeledInputProps) {
    const [localValue, setLocalValue] = useState<string | number>(value);
    const [error, setError] = useState(false);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    function handleFocus(): void {
        if (localValue === 0) {
            setLocalValue("");
        }
    }

    const handleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setLocalValue(e.target.value);
            let value = parseFloat(e.target.value);
            let isValid = true;

            if (isNaN(value)) {
                isValid = false;
            } else {
                value = truncateDecimal(value, decimalPlaces);
                if (min !== undefined && value < min) {
                    isValid = false;
                }
                if (max !== undefined && max < value) {
                    isValid = false;
                }
            }

            setError(!isValid);
            if (isValid) {
                setStateValue!(value);
            }
        }, [decimalPlaces, min, max, setStateValue]
    );

    function handleBlur(): void {
        setLocalValue(value);
        setError(false);
    }

    return (
        <div className="relative">
            <input
                type={type}
                value={localValue}
                onFocus={handleFocus}
                onChange={!readOnly ? handleChange : undefined}
                onBlur={handleBlur}
                readOnly={readOnly}
                className={`w-[80px] outline-none border-b border-b-stone-400 ${error ? "focus:border-b-red-500" : ""}`}
            />
            {label && <label className="block text-stone-300 text-sm">{label}</label>}
            <div className="absolute text-xs text-red-500 whitespace-nowrap">{error ? errorMessage : ""}</div>
        </div>
    );
}

export default LabeledInput;
