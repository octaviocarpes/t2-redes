import client from './client.js';
import readFile from '../util/readFile.js';
const SERVER_PORT = 41234;

const slowStart = () => {
  console.log('Slow start...');
};

const fastRetransmit = () => {
  console.log('Fast retransmit...');
};

const uploadFileToServer = () => {
  const file = readFile('src/client/text.txt'); // 3008
  // begin slow start
  slowStart();
  // begin fast retransmit
  fastRetransmit();
  const offset = 0;
  const length = 1500;
  client.send(file, offset, length)
}

client.connect(SERVER_PORT, () => {
  console.log('client connected!');
  console.log('Sending file...');
  uploadFileToServer();
});