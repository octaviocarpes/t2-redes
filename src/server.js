import dgram from "dgram";
const server = dgram.createSocket("udp4");
let ack = 0;

server.bind(41234);

// Prints: server listening 0.0.0.0:41234
server.on("listening", () => {
    const local = server.address();
    console.log(`server listening ${local.address}:${local.port}`);
});

server.on("error", (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

server.on("message", async (msg, rinfo) => {
    const msgLength = `${msg}`.length;
    ack = ack + msgLength;
    try {
        await send(`ack-${ack}`, rinfo);
    } catch (e) {
        console.log(e);
    }
});

async function send(message, rinfo) {
    return new Promise((resolve, reject) =>
        server.send(
            message,
            0,
            message.length,
            rinfo.port,
            rinfo.address,
            (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            }
        )
    );
}
