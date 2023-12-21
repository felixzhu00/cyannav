import { createContext, useState, useContext, useEffect, useRef } from "react";

function UndoRedo() {
    const MAX_UNDOS = 20;
    const MAX_REDOS = 20;

    // const [undo, setUndo] = useState([]);
    // const [redo, setRedo ] = useState([]);

    const undoRef = useRef([]);
    const redoRef = useRef([]);

    const addUndo = (newStep) => {
        if (undoRef.current.length > MAX_UNDOS - 1) {
            undoRef.current = [...undoRef.current.slice(1), newStep];
        } else {
            undoRef.current = [...undoRef.current, newStep];
        }

        // Remove any redo steps that involves the same field
        // and geometry
        // Also redo steps that involves this field.
        for (let i = 0; i < redoRef.current.length; i++) {
            if (
                (newStep[0] == redoRef.current[i][0] ||
                    redoRef.current[i][0] < 0) &&
                newStep[1] == redoRef.current[i][1]
            ) {
                console.log("w");
                redoRef.current.splice(i, 1);
                i--;
            }
        }
    };

    const addRedo = (newStep) => {
        if (redoRef.current.length > MAX_REDOS - 1) {
            redoRef.current = [...redoRef.current.slice(1), newStep];
        } else {
            redoRef.current = [...redoRef.current, newStep];
        }
    };

    const getUndo = () => {
        if (undoRef.current.length == 0) {
            return null;
        }

        const prevStep = undoRef.current[undoRef.current.length - 1];
        undoRef.current = [...undoRef.current.slice(0, -1)];
        addRedo(prevStep);
        return prevStep;
    };

    const getRedo = () => {
        if (redoRef.current.length == 0) {
            return null;
        }

        const nextStep = redoRef.current[redoRef.current.length - 1];
        redoRef.current = [...redoRef.current.slice(0, -1)];
        addUndo(nextStep);
        return nextStep;
    };

    // Debugging function
    const printUndoRedo = () => {
        console.log("UNDOS:");
        console.log(undo);
        console.log("REDOS:");
        console.log(redo);
    };

    const getAllSteps = () => {
        return [undoRef.current, redoRef.current];
    };

    return { addUndo, addRedo, getUndo, getRedo, printUndoRedo, getAllSteps };
}

export default UndoRedo;
