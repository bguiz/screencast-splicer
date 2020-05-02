#!/usr/bin/env node

const screencastSplicer = require('./screencast-splicer.js');

const [,, inputFileName, outputFileName] = process.argv;

screencastSplicer
  .generateShellScript(inputFileName, outputFileName)
  .then(console.log, console.error);
