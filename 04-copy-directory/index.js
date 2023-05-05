const fsPromise = require('fs/promises');
const path = require('path');

const sourcePath = path.join(__dirname, 'files');
async function copyDir(newPath) {
  newPath = sourcePath.split(path.sep)[sourcePath.split(path.sep).length-1]
  await createDirectory(path.join(__dirname,`${newPath}-copy`));
  await copyFile(sourcePath, path.join(__dirname, `${newPath}-copy`))
}

async function createDirectory(name) {
  await fsPromise.mkdir(name, {
    recursive: true,
  });
}
async function copyFile(from, to) {
  let res = await fsPromise.readdir(from)
  res.map(item => {
    return fsPromise.copyFile(path.join(from, item), path.join(to, item))
  })
  return res;
}
copyDir(sourcePath).catch(console.error);