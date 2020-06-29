import { deleteTemporaryFiles } from "./deleteTemporary.js";
import { increaseLastSent } from "./client.js";

let slowStartSequence = 2;

export const slowStart = ({
    send,
    fileArray,
    socket,
    sequence,
    arrayLength,
    lastSent,
}) => {
    console.log(`Sending ${slowStartSequence} packets simultaneously`);
    for (let i = 0; i < slowStartSequence; i++) {
        if (lastSent === arrayLength) {
            break;
        }
        send(fileArray[sequence - 1 + i], socket, sequence + i, arrayLength);
        increaseLastSent();
        lastSent++;
    }
    slowStartSequence = slowStartSequence * 2;
};

export const resetSlowStart = () => {
    slowStartSequence = 2;
};
