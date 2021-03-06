import crcCreate from "../util/createCrc.js";
import fs from "fs";

export const send = (array, socket, sequence, total) => {
    const file = fileObject(array, sequence, total);
    console.log(`Sending sequence ${sequence} of ${total}`);
    socket.send(file, 0, lengthInUtf8Bytes(file));
};

const fileObject = (data, sequence, total) => {
    try {
        const file = fs.readFileSync(data);
        const obj = {
            data: file,
            crc: crcCreate(file),
            sequence: sequence,
            total,
        };
        return JSON.stringify(obj);
    } catch (e) {}
};

function lengthInUtf8Bytes(str) {
    const m = encodeURIComponent(str).match(/%[89ABab]/g);
    return str.length + (m ? m.length : 0);
}
