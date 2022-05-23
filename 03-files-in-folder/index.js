const path = require('path');
const fs = require('fs');

const ONE_KILOBYTE = 1024;

const startFolderPath = path.join(__dirname, '/secret-folder');

fs.readdir(startFolderPath, {withFileTypes: true}, (err, files) => {
  errorHandle(err);

  files.forEach((file) => {
    fileHandler(file);
  });
});

function fileHandler(file) { 
  if(file.isFile()) {
    const splitName = file.name.split('.');
    const fileName = splitName[0];
    const fileExtension = splitName[1];
    const filePath = path.join(__dirname, '/secret-folder', file.name);

    fs.stat(filePath, (err, stats) => {
      errorHandle(err);

      const fileSize = (stats.size / ONE_KILOBYTE);

      console.log(`${fileName} - ${fileExtension} - ${fileSize}kb`);

    });
  }
}

function errorHandle(err) {
  if (err) {
    return console.error(err);
  }
}