const path = require('path');
const fs = require('fs');

module.exports = {
  generateShellScript,
  generateFfmpegConcatInput,
  generateFfmpegCommands,
  generateFfmpegCommand,
  twoDigit,
};

async function generateShellScript(inputFileName, outputFileName) {
  const instructionsBuffer =
    await fs.promises.readFile(inputFileName);
  const instructions =
    JSON.parse(instructionsBuffer.toString());

  const outputFilePath = path.parse(outputFileName);
  const ffmpegConcatFileName =
    `${outputFilePath.name}-ffmpeg-concat.tmp.txt`;
  const ffmpegScriptFileName =
    `${outputFilePath.name}-ffmpeg.tmp.sh`;
  const ffmpegCommands =
    generateFfmpegCommands(instructions.events, outputFileName);

  const ffmpegConcatInput =
    ffmpegCommands.map(
      (cmd) => (cmd[2]),
    ).join('\n') + '\n';
  await fs.promises.writeFile(
    ffmpegConcatFileName,
    ffmpegConcatInput,
    { mode: 0o664 },
  );

  const ffmpegScript = [
    '#!/bin/sh\n\n# slice pieces',
    ...(ffmpegCommands.map(
      (cmd) => (cmd[1]),
    )),

    '\n# concatenate pieces',
    `ffmpeg -f concat -safe 0 \\`,
    ` -i ${ffmpegConcatFileName} \\`,
    ` -c copy ${outputFileName}`,

    '\n# clean up',
    ...(ffmpegCommands.map(
      (cmd) => (cmd[3]),
    )),
    `rm "${ffmpegConcatFileName}"`,
    `rm "${ffmpegScriptFileName}"`,
  ].join('\n') + '\n';
  await fs.promises.writeFile(
    ffmpegScriptFileName,
    ffmpegScript,
    { mode: 0o764 },
  );

  return ffmpegScriptFileName;
}

function generateFfmpegConcatInput(command) {
  const tempFileName = command[0];
  return `file '${tempFileName}'`;
}

function generateFfmpegCommands(events, outputFileName) {
  const outputFilePath = path.parse(outputFileName);
  return events.map((event, index) => {
    const tempFileName =
      `${outputFilePath.name}.${twoDigit(index + 1)}.tmp${outputFilePath.ext}`;
    return generateFfmpegCommand(event, tempFileName);
  });
}

function generateFfmpegCommand(event, tempFileName) {
  return [
    tempFileName,
    `ffmpeg -i "${event.sourceClip
      }" -ss "${event.sourceStart
      }" -t "${event.sourceDuration
      }" -c copy "${tempFileName}"`,
    `file '${tempFileName}'`,
    `rm "${tempFileName}"`,
  ];
}

function twoDigit(number) {
  const num = parseInt(number, 10);
  if (num !== number) {
    throw new Error(`Value is not an integer: ${number}`);
  }
  if (num < 0 || num > 99) {
    throw new Error(`Value is out of range: ${num}`);
  }
  if (num < 10) {
    return `0${num}`;
  } else {
    return `${num}`;
  }
}
