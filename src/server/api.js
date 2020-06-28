import dgram from "dgram";

const api = dgram.createSocket({ type: "udp4", reuseAddr: true });

export default api;
