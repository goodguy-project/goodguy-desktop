import {useEffect, useState} from "react";
import {LogError} from "../../wailsjs/runtime";

export default function Sync<T>(promise: Promise<T>, initial: () => T): T {
    const [state, setState] = useState<T>(initial());
    useEffect(() => {
        promise.then((value) => {
            setState(value);
        }).catch((err) => {
            LogError(err.toString());
        });
    }, []);
    return state;
}