import client from './client.js';
import readFile from '../util/readFile.js';
const SERVER_PORT = 41234;
const SERVER_ADDRESS = '189.6.202.186';

let lastAck = 0;
let offset = 0;
let slowStartSize = 1;

const file = readFile('src/client/text.txt'); // 3008
const fileSize = file.length;

const sendData = () => {
  return new Promise((resolve, reject) => {
    client.send(file, offset, 1471, error => {
      if (error) {
        reject();
      } else resolve();
    });
  });
}

const sequencialSend = async count => {
  for (let i = 1; i <= count; i++) {
    if (offset < fileSize) {
      console.log('Sending sequencial', i);
      await sendData();
      offset += 1471;
    }
  };
};

client.on('message', (msg, rinfo) => {
    console.log(`server got: ${msg} from ${rinfo.address}:${rinfo.port}`);
    // if ack for igual ao anterior troca pra 1 e comeca dnv
    const ack = parseInt(`${msg}`.split('-')[1]);

    if (ack === file.length) return;

    if (ack === offset) {
      slowStartSize = 1;
    } else {
      if (offset === 0) {
        offset = ack;
        slowStartSize = slowStartSize * 2;
        sequencialSend(slowStartSize);
      }
      slowStartSize = slowStartSize * 2;
    };

    console.log(offset, ack, slowStartSize);

    if (ack === (slowStartSize * 1471 + 1471)) {
      return
    }
    sequencialSend(slowStartSize);
});

client.connect(SERVER_PORT, SERVER_ADDRESS, () => {
  console.log('Client connected!');
  sendData();
});