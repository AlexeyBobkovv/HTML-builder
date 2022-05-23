const fs = require('fs');
const path = require('path');

const mainFolderPath = path.join(__dirname, 'files');
const copiedFolderPath = path.join(__dirname, 'files-copy');

function copyDir(mainFolderPath, copiedFolderPath) {
  fs.mkdir(copiedFolderPath, { recursive: true }, (err) => {
    errorHandle(err);
  });

  fs.readdir(mainFolderPath, { withFileTypes: true }, (err, files) => {
    errorHandle(err);

    files.forEach(file => {
      const mainFilePath = path.join(mainFolderPath, file.name);
      const copiedMainFilePath = path.join(copiedFolderPath, file.name);

      fileHander(file, mainFilePath, copiedMainFilePath);
      dirHander(file, mainFilePath, copiedMainFilePath);
    });
  });
}

function errorHandle(err) {
  if (err) {
    return console.error(err);
  }
}

function fileHander(file, mainFilePath, copiedmainFilePath) {
  if (file.isFile()) {
    fs.copyFile(mainFilePath, copiedmainFilePath, (err) => {
      errorHandle(err);
    });
  }
}

function dirHander(file, mainFilePath, copiedmainFilePath) {
  if (file.isDirectory()) {
    copyDir(mainFilePath, copiedmainFilePath);
  }
}


copyDir(mainFolderPath, copiedFolderPath);