const fs = require('fs');
const path = require('path');

const mainFolderPath = path.join(__dirname, 'styles');
const output = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
  (err) => {
    errorHandle(err);
  },
);

fs.readdir(mainFolderPath, { withFileTypes: true }, (err, files) => {
  errorHandle(err);

  files.forEach((file) => {
    if (file.isFile()) {
      const filePath = path.join(mainFolderPath, file.name);
      const splitName = file.name.split('.');
      const fileExtension = splitName[1];

      if (fileExtension === 'css') {
        const readStream = fs.createReadStream(filePath, 'utf-8');
        let data = '';

        readStream.on('data', (chunk) => (data += chunk));
        readStream.on('end', () => {
          output.write(data.trim());
          output.write('\n\n');
        });
        readStream.on('error', (err) => {
          errorHandle(err);
        });
      }
    }
  });
});

function errorHandle(err) {
  if (err) {
    return console.error(err);
  }
}