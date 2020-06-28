import { readFile } from "../util/manageFile.js";
import socket, { connect } from "./api.js";
import { send } from "./socket.js";
import { slowStart } from "./fastRetransmit.js";
import { fastRetransmit, lastSent, sequence } from "./fastRetransmit.js";

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

        if (ack === lastSent) {
            for (let i = 0; i < slowStart; i++) {
                send(
                    fileArray[sequence - 1 + i],
                    socket,
                    sequence + i,
                    arrayLength
                );
                lastSent += 1;
            }
        }
    });
};

start();
