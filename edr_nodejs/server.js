const WebSocket = require("ws");
const os = require("os");
const { GlobalKeyboardListener } = require("node-global-key-listener");
const { log } = require("console");

// Set up WebSocket server
const wss = new WebSocket.Server({ port: 8765 });
console.log("WebSocket server started on ws://localhost:8765");

const interval = 5000;

// Global state for data collection
let sessionId = null;
let isCollecting = false;
let intervalHandle = null;

// Set up keyboard listener
const actionListener = new GlobalKeyboardListener();

// Maintain a set of currently pressed keys
const pressedKeys = new Set();
let actions = 0;

// Listen for keyboard events
actionListener.addListener((e) => {
  if (e.state === "DOWN") {
    if (!pressedKeys.has(e.name)) {
      actions++;
      console.log(`Action detected! Total actions: ${actions}`);
    }
    pressedKeys.add(e.name); // Add the key to the set
  } else if (e.state === "UP") {
    pressedKeys.delete(e.name); // Remove the key when released
  }
});

let previousCpuTimes = os.cpus().map((cpu) => cpu.times);

// Calculate CPU usage
function getCpuUsage() {
  const currentCpuTimes = os.cpus().map((cpu) => cpu.times);

  let idleDifference = 0;
  let totalDifference = 0;

  for (let i = 0; i < currentCpuTimes.length; i++) {
    const prev = previousCpuTimes[i];
    const curr = currentCpuTimes[i];

    const idle = curr.idle - prev.idle;
    const total =
      curr.user +
      curr.nice +
      curr.sys +
      curr.irq +
      curr.idle -
      (prev.user + prev.nice + prev.sys + prev.irq + prev.idle);

    idleDifference += idle;
    totalDifference += total;
  }

  previousCpuTimes = currentCpuTimes; // Update previous times for the next call

  const usagePercentage = (
    (1 - idleDifference / totalDifference) *
    100
  ).toFixed(2);
  return usagePercentage;
}

// Collect system and input data
function collectData() {
  const memoryUsage = process.memoryUsage();
  return {
    timestamp: new Date().toISOString(),
    sessionId,
    cpuUsage: getCpuUsage(),
    memoryUsage:
      +(os.totalmem() / 1024 / 1024).toFixed(2) -
      +(os.freemem() / 1024 / 1024).toFixed(2),
    actions: actions,
  };
}

// Broadcast data to all connected clients
function broadcastData(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(message);
    }
  });
}

// Handle new client connections
wss.on("connection", (ws) => {
  console.log("Client connected"); // Log when a client connects
  actions = 0;

  // Listen for messages from the client
  ws.on("message", (message) => {
    console.log(`Received message from client: ${message}`);

    try {
      const command = JSON.parse(message);

      if (command.type === "start") {
        if (!isCollecting) {
          console.log("Starting data collection...");
          isCollecting = true;
          sessionId = command.id;
          console.log(sessionId);

          intervalHandle = setInterval(() => {
            const data = collectData();
            broadcastData(data);
            actions = 0;
          }, interval);
        }
      } else if (command.type === "stop") {
        if (isCollecting) {
          console.log("Stopping data collection...");
          isCollecting = false;
          clearInterval(intervalHandle);
          intervalHandle = null;
        }
      }
    } catch (err) {
      console.error("Error processing message:", err);
    }
  });

  // Listen for messages from the client
  ws.on("message", (message) => {
    console.log(`Received message from client: ${message}`);

    // Send a response back to the client
    // broadcastData(`Server received: "${message}"`);
  });

  // Clean up when the client disconnects
  ws.on("close", () => {
    console.log("Client disconnected");
  });
});
