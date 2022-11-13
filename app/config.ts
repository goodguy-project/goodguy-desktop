import * as fs from "fs";
import * as path from "path";

export default function GetConfig() {
    try {
        const data = fs.readFileSync(path.join(process.cwd(), '.goodguy-desktop', 'config.json'));
        const config = JSON.parse(data.toString());
        return typeof config === 'object' ? config : {};
    } catch (e) {
    }
    return {};
}