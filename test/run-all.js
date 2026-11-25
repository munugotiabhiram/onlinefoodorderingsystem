const { fork } = require('child_process');
const path = require('path');

const server = fork(path.join(__dirname, '..', 'server.js'), [], {
  env: { ...process.env, PORT: '3000' }
});

setTimeout(() => {
  const runner = fork(path.join(__dirname, 'test-system.js'), [], {
    env: { ...process.env, PORT: '3000' }
  });

  runner.on('exit', (code) => {
    server.kill();
    process.exit(code);
  });
}, 1500);
