export let sequence = 1;
export let slowStart = 1;
export let lastSent = 1;
import {send} from "./socket.js";

export const fastRetransmit = (ack, array, socket, total) => {
    if (ack === sequence + 1) {
        sequence += 1;
        if (lastSent + 1 === ack) {
            slowStart = slowStart * 2;
        }
    } else {
        slowStart = 1;
        sequence = ack;
        send(array[sequence - 1], socket, sequence, total)
        lastSent = sequence
    }
};

export const updateLastSent = () => {
    lastSent++;
};
