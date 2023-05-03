'use strict';
const fs = require('fs');
const {stdout} = process;
const readline = require('node:readline');
const path = require('path');
const Emitter = require('events');

const emitter = new Emitter();
const pathToFile = path.join(__dirname, 'note.txt');
const stream = fs.createWriteStream(pathToFile, {flags: 'a'});
const rdln = readline.createInterface(
  {
    input: process.stdin,
    output: process.stdout,
  });

stdout.write(`> Пожалуйста, укажите текст для сохранения в файл\n> Ctrl+C для выхода\n`);
rdln.on('SIGINT', () => {
  console.log('> Работа завершена');
  rdln.close()
});
rdln.on('line', (input) => {
  emitter.emit('closeApp', input);
  stream.write(input + '\n');
})
emitter.on('closeApp', (exit) => {
  if (exit.toLowerCase() === 'exit') {
    process.exit();
  }
})
stream.on('end', () => {
  console.log('Достиг конца, но ничего не прочитал.');
});
