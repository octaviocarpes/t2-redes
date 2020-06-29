import { readFile } from "../util/manageFile.js";
import socket, { connect } from "./api.js";
import { send } from "./socket.js";
import { slowStart, resetSlowStart } from "./slowStart.js";

let receivedAck = 0;
let lastSent = 0;

const start = async () => {
    const filePath = "src/temp/picture.png";
    const fileArray = await readFile(filePath);
    await connect();
    const arrayLength = fileArray.length;
    send(fileArray[0], socket, 1, arrayLength);
    lastSent = 1;

    socket.on("message", async (msg) => {
        const parsedMsg = `${msg}`;
        const ack = Number(parsedMsg.split("-")[1]);

        // fast retransmit
        if (ack === receivedAck) {
            socket.close();
            resetSlowStart();
            await sleep();
            send(fileArray[ack - 1], socket, ack, arrayLength);
            return;
        }

        receivedAck = ack;

        // slow start
        if (ack === lastSent + 1) {
            slowStart({
                send,
                fileArray,
                socket,
                sequence: lastSent + 1,
                arrayLength,
                lastSent,
            });
        }
    });
};

const sleep = () => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), 2000);
    });
};

export const increaseLastSent = () => {
    lastSent++;
};

start();
