import crc from "crc";

export default function crcCreate(file) {
    return crc.crc32(file).toString(16);
}
