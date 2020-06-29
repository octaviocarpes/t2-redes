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
import fs from "fs";

let foo = [1];
let retransmitted = false;

const start = async () => {
    const filePath = "src/temp/picture.png";
    const fileArray = await readFile(filePath);
    await connect();
    const arrayLength = fileArray.length;
    send(fileArray[0], socket, 1, arrayLength);

    socket.on("message", (msg) => {
        const parsedMsg = `${msg}`;
        const ack = Number(parsedMsg.split("-")[1]);

        if (foo[foo.length - 1] < ack && !foo.includes(ack)) {
            foo.push(ack);
            retransmitted = false;

            fastRetransmit(ack);

            if (ack === lastSent + 1) {
                console.log(`Sending ${slowStart} packages`);
                for (let i = 0; i < slowStart; i++) {
                    if (lastSent === arrayLength) {
                        console.log("Deleting temporary files");
                        for (const path of fileArray) {
                            fs.unlink(path, (err) => {
                                if (err) {
                                } else {
                                    console.log("Arquivo removido");
                                }
                            });
                        }
                        break;
                    }
                    send(
                        fileArray[sequence - 1 + i],
                        socket,
                        sequence + i,
                        arrayLength
                    );
                    updateLastSent();
                }
            }
        } else {
            if (!retransmitted) {
                send(fileArray[sequence - 1], socket, sequence, arrayLength);
                retransmitted = true;
            } else {
                /* 
                    Se der merda de novo?
                    Recomeçar o processo?
                */
            }
        }
    });
};

start();
