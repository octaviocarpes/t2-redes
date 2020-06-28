import crc from "crc";
export let lastSequence = 1;

export const verifyCrc = (msg) => {
    const checkedCrc = crc.crc32(msg.data).toString(16);
    if (checkedCrc === msg.crc) {
        return true;
    } else {
        return lastSequence;
    }
};

export const verifySequence = (msg) => {
    if (msg.sequence === lastSequence) {
        lastSequence += 1;
        return true;
    } else {
        return lastSequence;
    }
};
