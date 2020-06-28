import socket from "./api.js";
import splitFile from "split-file";
import { verifySequence, verifyCrc, lastSequence } from "./socket.js";

const server = socket;
let file = [];

server.bind(41234);

// Prints: server listening 0.0.0.0:41234
server.on("listening", () => {
    const local = server.address();
    console.log(`server listening ${local.address}:${local.port}`);
});

server.on("error", (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on("message", async (msg, rinfo) => {
    let parsedMsg = JSON.parse(`${msg}`);

    console.log(
        `Receiving sequence: ${parsedMsg.sequence}, crc: ${parsedMsg.crc}`
    );

    if (verifyCrc(parsedMsg) !== true) {
        const lastSequence = verifyCrc(parsedMsg);
        await send(`ack-${lastSequence}`, rinfo);
        return;
    }

    if (verifySequence(parsedMsg) !== true) {
        const lastSequence = verifySequence(parsedMsg);
        await send(`ack-${lastSequence}`, rinfo);
        return;
    }

    file.push(parsedMsg.data);

    if (parsedMsg.sequence === parsedMsg.total) {
        await splitFile.mergeFiles(file, "destination/picture1.png");
    }

    await send(`ack-${lastSequence}`, rinfo);
});

async function send(message, rinfo) {
    return new Promise((resolve, reject) =>
        server.send(
            message,
            0,
            message.length,
            rinfo.port,
            rinfo.address,
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        )
    );
}
