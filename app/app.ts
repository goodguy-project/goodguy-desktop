import {app, BrowserWindow, screen, protocol, ipcMain, dialog} from "electron";
import * as path from "path";
import {GetConfig, GetExternalResourcesRoot} from "./config";
import Server from "./server";
import * as fs from "fs";

function application() {
    // prepare preload.js
    const pathPreloadJs = path.join(GetExternalResourcesRoot(), '.preload.js');
    const preloadJs = `
        const {contextBridge, ipcRenderer} = require('electron');
        contextBridge.exposeInMainWorld('app', {
            SelectFile: (properties) => ipcRenderer.invoke('SelectFile', properties),
            SaveFile: (filename, data) => ipcRenderer.invoke('SaveFile', filename, data),
        });
    `;
    fs.writeFileSync(pathPreloadJs, preloadJs);

    const createWindow = () => {
        ipcMain.handle('SelectFile', async (event, args) => {
            const properties = args.length > 0 ? args[0] : {};
            const {canceled, filePaths} = await dialog.showOpenDialog(Object.assign(properties, {
                properties: ['openFile'],
            }));
            return canceled ? null : filePaths[0];
        });
        ipcMain.handle('SaveFile', async (event, filename: string, data: string) => {
            const {canceled, filePaths} = await dialog.showOpenDialog({
                properties: ['openDirectory'],
            });
            if (!canceled && filePaths.length > 0) {
                const p = path.join(filePaths[0], filename);
                fs.writeFile(p, data, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
                return p;
            }
            return null;
        });
        const config = GetConfig();
        // Create the browser window.
        const win = new BrowserWindow({
            width: screen.getPrimaryDisplay().workAreaSize.width,
            height: screen.getPrimaryDisplay().workAreaSize.height,
            autoHideMenuBar: true,
            webPreferences: {
                preload: pathPreloadJs,
            },
        });
        win.maximize();
        // and load the index.html of the app.
        console.log(config);
        const host = config?.host || '0.0.0.0';
        const debug = config?.debug || false;
        // show loading page
        const html = path.join(GetExternalResourcesRoot(), 'react-page', 'index.html');
        protocol.registerBufferProtocol('goodguy', (request) => {
            const url = new URL(request.url);
            const urlParam = new URLSearchParams(new URL(url).search);
            switch (url.host) {
                case 'jump': {
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
                    break;
                }
                default:
                    console.log(`illegal url: ${request.url}`);
            }
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