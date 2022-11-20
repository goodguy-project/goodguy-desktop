import * as fs from "fs";
import * as path from "path";

export function GetExternalResourcesRoot(): string {
    const cwd = process.cwd();
    const dir = '.goodguy-desktop';
    return path.join(cwd, dir);
}

export function GetConfig() {
    try {
        const data = fs.readFileSync(path.join(GetExternalResourcesRoot(), 'config.json'));
        const config = JSON.parse(data.toString());
        return typeof config === 'object' ? config : {};
    } catch (e) {
    }
    return {};
}