const { stdin, stdout } = process;
const path = require('path');
const fs = require('fs');

const output = fs.createWriteStream(path.join(__dirname, 'text.txt'), (err) => {
  errorHandle(err);
});

function errorHandle(err) {
  if (err) {
    return console.error(err);
  }
}

stdout.write('Hi,friend, write the text, please\n');  
stdin.on('data', data => {
  const enteredText = data.toString();

  if (enteredText.trim() === 'exit') {
    stdout.write('Well, bye!\n');
    process.exit();
  }

  output.write(enteredText);
});

function endOfProcessMessage() {
  stdout.write('Stop the procces? I thought we were friends..\n');
  process.exit();
}

process.on('SIGINT', endOfProcessMessage);