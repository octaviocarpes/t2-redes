export let sequence = 1;
export let slowStart = 1;
export let lastSent = 1;

export const fastRetransmit = (ack) => {
    if (ack === sequence + 1) {
        sequence += 1;
        if (lastSent + 1 === ack) {
            slowStart = slowStart * 2;
        }
    } else {
        slowStart = 1;
        sequence = ack;
    }
};
