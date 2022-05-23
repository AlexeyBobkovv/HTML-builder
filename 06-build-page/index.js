const fs = require('fs');
const path = require('path');

const assetsPath = path.join(__dirname, '/assets');
const copiedAssetsPath = path.join(__dirname, '/project-dist/assets');
const stylesPath = path.join(__dirname, '/styles');
const templatePath = path.join(__dirname, 'template.html');
const indexPath = path.join(__dirname, 'project-dist', 'index.html');

fs.mkdir(path.join(__dirname, 'project-dist'), { recursive: true }, (err) => {
  errorHandle(err);
});

function copyAssets(mainFolderPath, copiedFolderPath) {
  fs.mkdir(copiedFolderPath, { recursive: true }, (err) => {
    errorHandle(err);
  });

  fs.readdir(mainFolderPath, { withFileTypes: true }, (err, files) => {
    files.forEach((file) => {
      const mainFilePath = path.join(mainFolderPath, file.name);
      const copiedMainFilePath = path.join(copiedFolderPath, file.name);

      fileHander(file, mainFilePath, copiedMainFilePath);
      dirHander(file, mainFilePath, copiedMainFilePath);
    });
  });
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
    copyAssets(mainFilePath, copiedmainFilePath);
  }
}

copyAssets(assetsPath, copiedAssetsPath);

function mergeStyles() {
  const createStyleFile = fs.createWriteStream(
    path.join(__dirname, 'project-dist', 'bundle.css'),
    (err) => {
      errorHandle(err);
    },
  );

  fs.readdir(stylesPath, { withFileTypes: true }, (err, files) => {
    errorHandle(err);
  
    files.forEach((file) => {
      if (file.isFile()) {
        const filePath = path.join(stylesPath, file.name);
        const splitName = file.name.split('.');
        const fileExtension = splitName[1];
  
        if (fileExtension === 'css') {
          const readStream = fs.createReadStream(filePath, 'utf-8');
          let data = '';
  
          readStream.on('data', (chunk) => (data += chunk));
          readStream.on('end', () => {
            createStyleFile.write(data.trim());
            createStyleFile.write('\n\n');
          });
          readStream.on('error', (err) => {
            errorHandle(err);
          });
        }
      }
    });
  });
}

mergeStyles();

function mergeHTML() {
  fs.copyFile(templatePath, indexPath, (err) => {
    errorHandle(err);
  });
  
  fs.readFile(templatePath, 'utf-8', (err, data) => {
    errorHandle(err);
  
    let templateData = data;
    const templateTags = data.match(/{{\w+}}/gm);
  
    for (let tag of templateTags) {
      const tagPath = path.join(
        __dirname,
        '/components',
        `${tag.slice(2, -2)}.html`,
      );
  
      fs.readFile(tagPath, 'utf-8', (err, dataTag) => {
        errorHandle(err);
  
        templateData = templateData.replace(tag, dataTag);
  
        fs.rm(indexPath, { recursive: true, force: true }, (err) => {
          errorHandle(err);
          
          const index = fs.createWriteStream(indexPath);
          index.write(templateData);
        });
      });
    }
  });
}

mergeHTML();

function errorHandle(err) {
  if (err) {
    return console.error(err);
  }
}