const fs = require('fs/promises');
const path = require('path');

const pathToDirectory = path.join(__dirname, 'secret-folder');

fs.readdir(pathToDirectory, { withFileTypes: true })
  .then(array => array.map(direntObj => {
    return {
      fileName: direntObj.name,
      isFile: direntObj.isFile(),
      extension: path.extname(path.join(__dirname, 'secret-folder', direntObj.name)).replace('.', '')
    };
  }))
  .then(result => result.filter(elem => elem.isFile))
  .then(stat => {
    const promises = stat.map(item => {
      return fs.stat(path.join(__dirname, 'secret-folder', item.fileName))
        .then(result => {
          item.size = (result.size / 1024).toFixed(3);
          return item;
        });
    });
    return Promise.all(promises);
  })
  .then(result => result.map(elem => `${elem.fileName.split('.')[0]}-${elem.extension}-${elem.size}Kb`))
  .then(result => console.log(result))
  .catch(error => console.log(error.message));