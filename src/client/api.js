import dgram from "dgram";

const api = dgram.createSocket({ type: "udp4", reuseAddr: true });

export const connect = async () => {
    return new Promise((resolve, reject) => {
        api.connect(41234, "192.168.0.51", (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export default api;
