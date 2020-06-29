import socket from "./api.js";
import splitFile from "split-file";
import { exec } from "child_process";
import { verifySequence, verifyCrc, lastSequence } from "./socket.js";
import fs from "fs";

const server = socket;
let file = [];

const EXEC_SHA = "shasum -a 256 src/temp/picture.png";
const VERIFY_SHA = "openssl sha256 src/temp/picture.png";

const executeShellCommand = (command) => {
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
    });
};

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
    let parsedMsg = JSON.parse(`${msg}`);

    console.log(
        `Receiving sequence: ${parsedMsg.sequence}, crc: ${parsedMsg.crc}`
    );

    if (verifyCrc(parsedMsg) !== true) {
        const lastSequence = verifyCrc(parsedMsg);
        await send(`ack-${lastSequence}`, rinfo);
        return;
    }

    if (verifySequence(parsedMsg) !== true) {
        const lastSequence = verifySequence(parsedMsg);
        await send(`ack-${lastSequence}`, rinfo);
        return;
    }

    const buf1 = Buffer.from(parsedMsg.data.data);

    const path = `src/server/destination/picture.png.sf-part${String(
        parsedMsg.sequence
    ).padStart(3, "0")}`;

    fs.writeFileSync(path, buf1);

    file.push(path);

    if (parsedMsg.sequence === parsedMsg.total) {
        console.log("Merging packets...");
        await splitFile.mergeFiles(file, "src/server/destination/picture1.png");
        console.log("Deleting temporary files");
        for (const path of file) {
            fs.unlinkSync(path);
        }
        console.log("File uploaded successfully!");
        console.log("Verifying file SHASUM256...");
        executeShellCommand(EXEC_SHA);
        console.log("Validating file with openssl...");
        executeShellCommand(VERIFY_SHA);
    }

    await send(`ack-${lastSequence}`, rinfo);
});

async function send(message, rinfo) {
    console.log(`Sending ack ${lastSequence}`);
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
