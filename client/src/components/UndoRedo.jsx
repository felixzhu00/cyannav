import { createContext, useState, useContext, useEffect } from "react";

function UndoRedo() {
    const MAX_UNDOS = 20;
    const MAX_REDOS = 20;

    const [undo, setUndo] = useState([]);
    const [redo, setRedo] = useState([]);

    const addUndo = (newStep) => {
        if (undo.length > MAX_UNDOS - 1) {
            setUndo([...undo.slice(1), newStep]);
        } else {
            setUndo([...undo, newStep]);
        }

        // Remove any redo steps that involves the same field
        // and geometry
        for (let i = 0; i < redo.length; i++) {
            if (newStep[0] == redo[i][0] && newStep[1] == redo[i][1]) {
                redo.splice(i, 1);
                i--;
            }
        }
    };

    const addRedo = (newStep) => {
        if (redo.length > MAX_REDOS - 1) {
            setRedo([...redo.slice(1), newStep]);
        } else {
            setRedo([...redo, newStep]);
        }
    };

    const getUndo = () => {
        const prevStep = undo[undo.length - 1];
        addRedo(prevStep);
        return prevStep;
    };

    const getRedo = () => {
        const nextStep = redo[redo.length - 1];
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

    return { addUndo, addRedo, getUndo, getRedo, printUndoRedo };
}

export default UndoRedo;
