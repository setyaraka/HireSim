const { spawn } = require('child_process');
const net = require('net');
const fs = require('fs');
const path = require('path');

const command = process.argv[2] || 'dev'; // 'dev' or 'start'

// Function to check if a port is available
function checkPort(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false); // Port is in use
      } else {
        resolve(true); // Some other error
      }
    });
    server.once('listening', () => {
      server.close(() => {
        resolve(true); // Port is available
      });
    });
    server.listen(port);
  });
}

// Function to find the first available port starting from startPort
async function findAvailablePort(startPort) {
  let port = startPort;
  while (true) {
    const isAvailable = await checkPort(port);
    if (isAvailable) {
      return port;
    }
    console.log(`Port ${port} is in use, checking next...`);
    port++;
  }
}

// Function to check and kill previous dev server instance running in this workspace
function checkAndKillPreviousInstance() {
  const lockPath = path.join(process.cwd(), '.next', 'dev', 'lock');
  if (fs.existsSync(lockPath)) {
    try {
      const lockData = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
      const pid = lockData.pid;
      if (pid) {
        try {
          // Check if process with that PID is active
          process.kill(pid, 0);
          console.log(`\x1b[36m[Info] Found an existing Next.js dev server running (PID: ${pid}). Stopping it to prevent conflicts...\x1b[0m`);
          
          // Send SIGTERM
          process.kill(pid, 'SIGTERM');
          
          // Wait up to 1 second for the process to exit
          let checkCount = 0;
          while (checkCount < 10) {
            try {
              process.kill(pid, 0);
              // Still running, sleep for 100ms
              const start = Date.now();
              while (Date.now() - start < 100) {}
              checkCount++;
            } catch (e) {
              // Process successfully stopped!
              break;
            }
          }

          // If still running after 1 second, send SIGKILL
          try {
            process.kill(pid, 0);
            process.kill(pid, 'SIGKILL');
          } catch (e) {}
        } catch (e) {
          // Process is not running, we can ignore
        }
      }
    } catch (e) {
      // Failed to parse lock file, ignore
    }

    // Clean up lock file
    try {
      fs.unlinkSync(lockPath);
    } catch (e) {}
  }
}

// Main execution
const defaultPort = parseInt(process.env.PORT || '3000', 10);

// Only kill previous instance in dev mode to avoid disrupting other active processes
if (command === 'dev') {
  checkAndKillPreviousInstance();
}

findAvailablePort(defaultPort).then((port) => {
  if (port !== defaultPort) {
    console.log(`\x1b[33mPort ${defaultPort} is already in use. Switching to port ${port}...\x1b[0m`);
  } else {
    console.log(`Starting Next.js on port ${port}...`);
  }

  // Spawn next command with the discovered port
  const child = spawn('npx', ['next', command, '-p', port.toString()], {
    stdio: 'inherit'
  });

  child.on('exit', (code) => {
    process.exit(code || 0);
  });
});
