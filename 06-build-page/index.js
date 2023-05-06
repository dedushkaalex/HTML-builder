const fsPromise = require('fs/promises');
const fs = require('fs');
const path = require('path');

const pathToHTML = path.join(__dirname, 'components');
const pathToStyles = path.join(__dirname, 'styles');

async function createDirectory(name) {
  await fsPromise.mkdir(name, {
    recursive: true,
  })
}
async function createObjectTemplates() {
  try {
    const files = await fsPromise.readdir(pathToHTML);
    const objectTemplate = {};
    for (const file of files) {
      const ext = path.extname(file);
      if (ext === '.html') {
        const fullPath = path.join(pathToHTML, file);
        const content = await readFile(fullPath);
        objectTemplate[file.split('.')[0]] = content;
      } else {
        const stats = await fsPromise.stat(path.join(pathToHTML, file));
        if (stats.isDirectory()) {
          console.log(`Directory: ${file}`);
        }
      }
      await buildHTML(path.join(__dirname, 'template.html'), objectTemplate )
    }
  } catch (err) {
    console.log(err);
  }
}
async function buildHTML(htmlFilePath, objTemplate) {
  const streamRead = fs.createReadStream(htmlFilePath, 'utf-8');
  const outputFilePath = path.join(__dirname, 'project-dist', 'index.html');
  const streamWrite = fs.createWriteStream(outputFilePath);
  return new Promise((resolve, reject) => {
    let text = '';
    streamRead.on('data', (chunk) => {
      text += chunk;
    });
    streamRead.on('end', () => {
      let data = text;
      for (const [key, value] of Object.entries(objTemplate)) {
        data = data.replace(new RegExp(`{{${key}}}`, 'g'), value);
      }
      streamWrite.write(data);
      streamWrite.end();
    });
    streamRead.on('error', (err) => {
      reject(err);
    });
    streamWrite.on('finish', () => {
      console.log('File written successfully');
      resolve();
    });
    streamWrite.on('error', (err) => {
      reject(err);
    });
  });
}


async function getDirectoryStyles() {
  try {
    const files = await fsPromise.readdir(pathToStyles);
    const arrayStyles = [];
    for (const file of files) {
      const ext = path.extname(file);
      if (ext === '.css') {
        const fullPath = path.join(pathToStyles, file);
        const content = await readFile(fullPath);;
        arrayStyles.push(content);
      } else {
        const stats = await fsPromise.stat(path.join(pathToStyles, file));
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
    const bundlePath = path.join(__dirname, 'project-dist', 'style.css');
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
async function copyFile(from, to) {
  let res = await fsPromise.readdir(from);
  for (const item of res) {
    const sourcePath = path.join(from, item);
    const destinationPath = path.join(to, item);

    const stats = await fsPromise.stat(sourcePath);
    if (stats.isDirectory()) {
      await createDirectory(destinationPath);
      await copyFile(sourcePath, destinationPath);
    } else {
      await fsPromise.copyFile(sourcePath, destinationPath);
    }
  }
  return res;
}


async function main() {
  await fsPromise.rm(path.join(__dirname, 'project-dist'), { recursive: true, force: true });
  await createDirectory(path.join(__dirname, 'project-dist'));
  await createObjectTemplates()
  await getDirectoryStyles();
  await copyFile(path.join(__dirname, 'assets'), path.join(__dirname, 'project-dist','assets'));
}

main();