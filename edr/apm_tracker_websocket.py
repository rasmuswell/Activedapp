import asyncio
import websockets
import json
from pynput import keyboard, mouse
import threading
import time
import sys
import psutil
import logging
import os

# Configure session-ID
session_id = "f5ab1809a2ec42afa946ffc2ba0741fd"

# Ensure the data directory exists
data_dir = os.path.join(os.path.dirname(__file__), "../data")
os.makedirs(data_dir, exist_ok=True)

# Configure the log file path
log_file_path = os.path.join(data_dir, f"activity_log_{session_id}.txt")

# WebSocket configuration
WEBSOCKET_SERVER = "ws://localhost:8765"  # Replace with your WebSocket server address

# Global counters
keystrokes = 0
mouse_clicks = 0
exit_program = False
pressed_keys = set()
interval = 5

# Lock for thread-safe operations
lock = threading.Lock()

# Target byte size for log lines
TARGET_BYTE_SIZE = 100

# WebSocket connection
class WebSocketLogger:
    def __init__(self, uri):
        self.uri = uri
        self.websocket = None
        self.loop = asyncio.new_event_loop()

    async def connect(self):
        try:
            self.websocket = await websockets.connect(self.uri)
            print(f"Connected to WebSocket server at {self.uri}")
        except Exception as e:
            print(f"WebSocket connection error: {e}")

    async def send_message(self, message):
        if self.websocket and self.websocket.open:
            try:
                await self.websocket.send(json.dumps(message))
            except Exception as e:
                print(f"Error sending WebSocket message: {e}")

    async def close(self):
        if self.websocket:
            await self.websocket.close()

    def start(self):
        asyncio.set_event_loop(self.loop)
        self.loop.run_until_complete(self.connect())

    def stop(self):
        if self.loop.is_running():
            self.loop.run_until_complete(self.close())
            self.loop.stop()

# Initialize WebSocket logger
websocket_logger = WebSocketLogger(WEBSOCKET_SERVER)

# Function to log with dynamic padding
def log_with_dynamic_padding(message):
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    full_message = f"{timestamp} - {message}"

    current_size = len(full_message.encode('utf-8'))

    if current_size < TARGET_BYTE_SIZE:
        padding_size = TARGET_BYTE_SIZE - current_size
        padding = ' ' * padding_size
        full_message += padding

    full_message += "$$$"

    # Log to file
    logging.info(full_message)

    # Prepare WebSocket message
    websocket_message = {
        "session_id": session_id,
        "timestamp": timestamp,
        "interval": interval,
        "message": message,
        "full_message": full_message
    }

    # Send to WebSocket in a separate thread
    threading.Thread(target=send_websocket_message, args=(websocket_message,), daemon=True).start()

# Function to send WebSocket message
def send_websocket_message(message):
    asyncio.set_event_loop(asyncio.new_event_loop())
    try:
        async def send():
            async with websockets.connect(WEBSOCKET_SERVER) as websocket:
                await websocket.send(json.dumps(message))
        asyncio.run(send())
    except Exception as e:
        print(f"WebSocket send error: {e}")

# Configure logging
logging.basicConfig(
    filename=log_file_path,
    level=logging.INFO,
    format="%(message)s"
)

# Keyboard monitoring function
def on_key_press(key):
    global keystrokes, exit_program, pressed_keys
    with lock:
        keystrokes += 1
        pressed_keys.add(key)

        # Check if Ctrl + Shift + Esc is pressed
        if (keyboard.Key.ctrl_l in pressed_keys or keyboard.Key.ctrl_r in pressed_keys) and \
           (keyboard.Key.shift in pressed_keys) and \
           (keyboard.Key.esc in pressed_keys):
            print("Exiting program...")
            log_with_dynamic_padding("Program terminated by Ctrl + Shift + Esc")
            exit_program = True
            return False

# Key release function
def on_key_release(key):
    if key in pressed_keys:
        pressed_keys.remove(key)

# Mouse monitoring function
def on_click(x, y, button, pressed):
    global mouse_clicks
    if pressed:
        with lock:
            mouse_clicks += 1

# Resource monitoring function
def monitor_resources():
    global keystrokes, mouse_clicks, exit_program
    while not exit_program:
        time.sleep(interval)
        with lock:
            total_actions = keystrokes + mouse_clicks
            cpu_usage = psutil.cpu_percent(interval=None)
            log_message = f"Actions: {total_actions}, CPU Usage: {cpu_usage}%"
            print(log_message)
            log_with_dynamic_padding(log_message)
            keystrokes = 0
            mouse_clicks = 0

# Main function to start the tracking
def main():
    global exit_program

    # Start WebSocket connection
    websocket_logger.start()

    # Start listeners
    keyboard_listener = keyboard.Listener(on_press=on_key_press, on_release=on_key_release)
    mouse_listener = mouse.Listener(on_click=on_click)

    # Start listeners and threads
    keyboard_listener.start()
    mouse_listener.start()

    # Start resource monitoring in a separate thread
    thread = threading.Thread(target=monitor_resources, daemon=True)
    thread.start()

    try:
        # Join the keyboard listener
        keyboard_listener.join()

        # Stop mouse listener
        mouse_listener.stop()

        # Stop WebSocket connection
        websocket_logger.stop()

        print("Program terminated successfully.")
        sys.exit(0)
    except KeyboardInterrupt:
        log_with_dynamic_padding("Program terminated by Ctrl+C")
        print("Program terminated by Ctrl+C.")
        sys.exit(0)

if __name__ == "__main__":
    main()