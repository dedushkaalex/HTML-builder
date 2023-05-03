const fs = require('fs');
const path = require('path');
const { stdout } = process;

const getFile = () => {
  const file = path.join(__dirname, 'text.txt');
  let threadFileRead = fs.createReadStream(file, 'utf-8');
  threadFileRead.on('data', (chunk) => {
    stdout.write(chunk);
  });
};
getFile();
