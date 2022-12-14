import * as portfinder from "portfinder";
import * as path from "path";
import * as child_process from "child_process";
import {GetConfig, GetExternalResourcesRoot} from "./config";
import axios from 'axios'; // bug with v1.1.3 https://github.com/axios/axios/issues/5011
// const axios = require('axios'); // module not found after package

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export default async function Server(host: string) {
    const realHost = host === '0.0.0.0' ? '127.0.0.1' : host;
    const port = await portfinder.getPortPromise();
    const exePath = path.join(GetExternalResourcesRoot(), 'backend', 'server.exe');
    const subprocess = child_process.spawn(exePath, [
        '--host', host, '--port', port.toString(),
    ], {cwd: path.dirname(exePath)});
    console.log(`server running: http://${host}:${port}`);
    if (GetConfig()?.debug) {
        subprocess.stdout.on('data', (data) => {
            console.log(data.toString());
        });
        subprocess.stderr.on('data', (data) => {
            console.log(data.toString());
        });
    }

    // make sure server is running
    let done = false;
    // let count = 0;
    while (!done) {
        // console.log(`count: ${count}`);
        // count++;
        try {
            await axios.post(`http://${realHost}:${port}/heartbeat`);
            done = true;
        } catch (e) {
            // console.log(e);
        }
        // sleep 200ms
        await sleep(200);
    }

    setInterval(() => {
        axios.post(`http://${realHost}:${port}/heartbeat`).catch((e: any) => {
            console.log('[fatal] server boomed!!!');
            setTimeout(() => {
                process.exit(1);
            }, 0);
        });
    }, 1000);

    console.log('server done');
    return port;
}