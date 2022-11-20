import {app, BrowserWindow, screen, protocol} from "electron";
import * as path from "path";
import {GetConfig, GetExternalResourcesRoot} from "./config";
import Server from "./server";

function application() {
    const createWindow = () => {
        const config = GetConfig();
        // Create the browser window.
        const win = new BrowserWindow({
            width: screen.getPrimaryDisplay().workAreaSize.width,
            height: screen.getPrimaryDisplay().workAreaSize.height,
            autoHideMenuBar: true
        });
        win.maximize();
        // and load the index.html of the app.
        console.log(config);
        const host = config?.host || '0.0.0.0';
        const debug = config?.debug || false;
        // show loading page
        const html = path.join(GetExternalResourcesRoot(), 'react-page', 'index.html');
        protocol.registerBufferProtocol('goodguy', (request) => {
            const urlParam = new URLSearchParams(new URL(request.url).search);
            if (config?.debug) {
                win.loadURL(`http://127.0.0.1:3000/?${urlParam.toString()}`);
                return;
            }
            const query = {};
            urlParam.forEach((value, key) => {
                // @ts-ignore
                query[key] = value;
            });
            win.loadFile(html, {query: query}).then(() => {
            });
        });
        const loadingPage = debug ? win.loadURL(`http://127.0.0.1:3000/?page=loading`) : win.loadFile(html, {
            query: {page: 'loading'}
        });
        // run server
        const server = Server(host);
        Promise.all([loadingPage, server]).then((value) => {
            const [_, port] = value;
            const realHost = host === '0.0.0.0' ? '127.0.0.1' : host;
            const promise = debug ?
                win.loadURL(`http://127.0.0.1:3000/?host=${realHost}&port=${port}`) :
                win.loadFile(html, {
                    query: {
                        host: realHost,
                        port: port.toString(),
                    }
                });
            promise.then(() => {
                console.log('react page load success');
            });
            // Open the DevTools.
            if (config?.debug || config?.dev_tool) {
                win.webContents.openDevTools(
                    {mode: 'detach'}
                );
            }
        });
    };

    // This method will be called when Electron has finished
    // initialization and is ready to create browser windows.
    // Some APIs can only be used after this event occurs.
    app.whenReady().then(createWindow);

    // Quit when all windows are closed, except on macOS. There, it's common
    // for applications and their menu bars to stay active until the user quits
    // explicitly with Cmd + Q.
    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit();
        }
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
}

application();

export {};