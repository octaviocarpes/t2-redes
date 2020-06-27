import dgram from 'dgram';
const server = dgram.createSocket('udp4');

server.bind(41234);

// Prints: server listening 0.0.0.0:41234
server.on('listening', () => {
    const local = server.address();
    console.log(`server listening ${local.address}:${local.port}`);
});

server.on('error', (err) => {
    console.log(`server error:\n${err.stack}`);
    server.close();
});

// let ack = false;

server.on('message', (msg, rinfo) => {
    const req = `${msg}`;

    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);

    if (req === 'file')
        send('file', rinfo);

    const [message, offset] = splitMessage(req);

    if (message  === 'ack') {
        send('Message qualquer', rinfo, offset);
        // ack = false;
    }
});

async function send(message, rinfo, offset = 0) {
    ack = true;
    const stringifiedMessage = JSON.stringify(message);

    let count = 1;

    while(ack) {
        console.log(`Transmission number ${count}`);
        server.send(stringifiedMessage, offset, 1500, rinfo.port, rinfo.address, function (err) {
            if (err)
                throw err;
        });

        await sleep(500);
        count++;
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function splitMessage(message) {
    try {
        return message.split('-'); // 'ack-100';
    } catch (error) {
        console.log(error);
    }
}