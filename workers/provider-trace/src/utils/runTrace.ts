const Traceroute = require('nodejs-traceroute');

interface Hop {
  hop: number;
  ip: string;
  rtt1: string | number;
}

export default function runTrace(ip: string, onHop: (hop: Hop) => void): Promise<void> {
  console.log("Tracing to", ip, "...");

  return new Promise((resolve, reject) => {
    try {
      const tracer = new Traceroute();
      let processId: number;
      let badHops = 0;

      tracer.on('pid', (pid: number) => {
        processId = pid;
      });

      tracer.on('hop', (hop: Hop) => {
        if (hop.rtt1 === '*') {
          badHops++;

          if (badHops > 5) {
            process.kill(processId);
            return;
          }
        }
        if (hop.rtt1 !== '*') {
          hop.rtt1 = parseFloat((hop.rtt1 as string).split(' ')[0]);
          onHop(hop);
        }
      });

      tracer.on('close', (code: number) => {
        if (code !== 0) {
          console.log(`Trace exited with non-standard code ${code}`);
        }
        resolve();
      });

      tracer.trace(ip);
    } catch (ex) {
      console.log(ex);
      reject(ex);
    }
  });
}