import dgram from "dgram";

const client = dgram.createSocket({ type: "udp4", reuseAddr: true });

export default client;
