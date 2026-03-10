const { spawn } = require('child_process');

function execCommand(command, args, customEnv = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      env: { ...process.env, ...customEnv },
      stdio: 'inherit'
    });

    child.on('error', (error) => {
      reject(error);
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command ${command} failed with exit code ${code}`));
      }
    });
  });
}

module.exports = { execCommand };
