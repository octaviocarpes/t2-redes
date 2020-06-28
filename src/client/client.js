import { readFile } from "../util/manageFile.js";
import socket, { connect } from "./api.js";
import { send } from "./socket.js";
import { slowStart } from "./fastRetransmit.js";
import {
    fastRetransmit,
    lastSent,
    sequence,
    updateLastSent,
} from "./fastRetransmit.js";

const start = async () => {
    const filePath = "src/temp/picture.png";
    const fileArray = await readFile(filePath);
    await connect();
    const arrayLength = fileArray.length;
    send(fileArray[0], socket, 1, arrayLength);

    socket.on("message", (msg) => {
        const parsedMsg = `${msg}`;
        const ack = Number(parsedMsg.split("-")[1]);

        fastRetransmit(ack);

        if (ack === lastSent + 1) {
            for (let i = 0; i < slowStart; i++) {
                if (lastSent === arrayLength) break;
                send(
                    fileArray[sequence - 1 + i],
                    socket,
                    sequence + i,
                    arrayLength
                );
                updateLastSent();
            }
        }
    });
};

start();
