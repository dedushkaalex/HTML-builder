const fsPromises = require('fs/promises');
const fs = require('fs');
const path = require('path');

const pathToStyles = path.join(__dirname, 'styles');

async function getDirectoryStyles() {
  try {
    const files = await fsPromises.readdir(pathToStyles);
    const arrayStyles = [];
    for (const file of files) {
      const ext = path.extname(file);
      if (ext === '.css') {
        const fullPath = path.join(pathToStyles, file);
        const content = await readFile(fullPath);;
        arrayStyles.push(content);
      } else {
        const stats = await fsPromises.stat(path.join(pathToStyles, file));
        if (stats.isDirectory()) {
          console.log(`Directory: ${file}`);
        }
      }
    }
    await writeBundle(arrayStyles);
  } catch (err) {
    console.log(err);
  }
}
getDirectoryStyles()

function readFile(file) {
  return new Promise((resolve, reject) => {
    let text = '';
    let streamRead = fs.createReadStream(file, 'utf-8');
    streamRead.on('data', (chunk) => {
      text += chunk;
    });
    streamRead.on('end', () => {
      resolve(text);
    });
    streamRead.on('error', (err) => {
      reject(err);
    });
  });
};

function writeBundle(arrayStyles) {
  return new Promise((resolve, reject) => {
    const bundlePath = path.join(__dirname,'project-dist', 'bundle.css');
    const streamWrite = fs.createWriteStream(bundlePath, { flags: 'w' });
    for (const content of arrayStyles) {
      streamWrite.write(content + '\n');
    }
    streamWrite.on('finish', () => {
      resolve();
    });
    streamWrite.on('error', (err) => {
      reject(err);
    });
    streamWrite.end();
  });
}