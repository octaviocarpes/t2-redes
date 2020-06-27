import fs from "fs";

export default function readFile(path) {
    return fs.readFileSync(path, 'utf8');
}
