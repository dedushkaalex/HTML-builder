const fsPromise = require('fs/promises');
const path = require('path');

const pathToDirectory = path.join(__dirname, 'secret-folder');

fsPromise.readdir(pathToDirectory, { withFileTypes: true })
  .then(
    array => {
      const arrayFiles = array.map(direntObj => {
        return {
          fileName: direntObj.name,
          isFile: direntObj.isFile(),
          extension: path.extname(path.join(__dirname, 'secret-folder', direntObj.name)).replace('.', '')
        };
      })
        .filter(item => item.isFile)
      const promises = arrayFiles.map(item => {
        return fsPromise.stat(path.join(__dirname, 'secret-folder', item.fileName))
          .then(result => {
            item.size = result.size;
            return item;
          })
          .then(result => result)
      })
      return Promise.all(promises);
    }
    )
  .then(
    result => console.log(result.map(elem => `${elem.fileName.split('.')[0]}-${elem.extension}-${elem.size}`))
    )
  .catch(error => console.log(error.message))