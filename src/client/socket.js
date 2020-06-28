import crcCreate from "../util/createCrc.js";

export const send = (array, socket, sequence, total) => {
    const file = fileObject(array, sequence, total);
    console.log(`Sending ${file}`);
    socket.send(file, 0, lengthInUtf8Bytes(file));
};

const fileObject = (data, sequence, total) => {
    const obj = {
        data,
        crc: crcCreate(data),
        sequence: sequence,
        total,
    };
    return JSON.stringify(obj);
};

function lengthInUtf8Bytes(str) {
    const m = encodeURIComponent(str).match(/%[89ABab]/g);
    return str.length + (m ? m.length : 0);
}
