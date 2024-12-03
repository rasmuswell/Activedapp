from pynput import keyboard, mouse
import threading
import time
import sys
import psutil  # Import psutil for CPU monitoring
import logging  # Import logging for file logging
import os  # Import os to handle file paths

# Configure session-ID
session_id = "2024-11-29"

# Ensure the data directory exists
data_dir = os.path.join(os.path.dirname(__file__), "../data")
os.makedirs(data_dir, exist_ok=True)

# Configure the log file path
log_file_path = os.path.join(data_dir, f"activity_log_{session_id}.txt")

# Global counters
keystrokes = 0
mouse_clicks = 0
exit_program = False  # Flag to exit program
pressed_keys = set()  # Track currently pressed keys

# Lock for thread-safe operations
lock = threading.Lock()

# Define the target byte size for each log line
TARGET_BYTE_SIZE = 100  # Change this to the desired byte size for each log line

# Function to log with dynamic padding
def log_with_dynamic_padding(message):
    # Convert the message into a string and calculate the byte size
    timestamp = time.strftime("%Y-%m-%d %H:%M:%S")
    full_message = f"{timestamp} - {message}"

    # Calculate current byte size of the message
    current_size = len(full_message.encode('utf-8'))

    # Pad the message if it is smaller than the target size
    if current_size < TARGET_BYTE_SIZE:
        padding_size = TARGET_BYTE_SIZE - current_size
        padding = ' ' * padding_size  # Pad with spaces (or choose a different character)
        full_message += padding

    # Add a dynamic delimiter
    full_message += "$$$"  # Dynamic delimiter to mark the end of the line

    # Write the message to the log file
    logging.info(full_message)

# Configure logging
logging.basicConfig(
    filename=log_file_path,  # Log file path
    level=logging.INFO,           # Log level
    format="%(message)s",         # Only the message part (timestamp and log message will be handled separately)
)

# Function to monitor keyboard
def on_key_press(key):
    global keystrokes, exit_program, pressed_keys
    with lock:
        keystrokes += 1

        # Add key to pressed keys set
        pressed_keys.add(key)

        # Check if Ctrl + Shift + Esc is pressed
        if (keyboard.Key.ctrl_l in pressed_keys or keyboard.Key.ctrl_r in pressed_keys) and \
           (keyboard.Key.shift in pressed_keys) and \
           (keyboard.Key.esc in pressed_keys):
            print("Exiting program...")
            log_with_dynamic_padding("Program terminated by Ctrl + Shift + Esc")
            exit_program = True
            return False  # Stop the keyboard listener

# Function to monitor key release
def on_key_release(key):
    # Remove key from pressed keys set
    if key in pressed_keys:
        pressed_keys.remove(key)

# Function to monitor mouse
def on_click(x, y, button, pressed):
    global mouse_clicks
    if pressed:
        with lock:
            mouse_clicks += 1

# Function to calculate APM and CPU usage
def monitor_resources():
    global keystrokes, mouse_clicks, exit_program
    while not exit_program:
        time.sleep(15)  # 1-minute intervals
        with lock:
            total_actions = keystrokes + mouse_clicks
            cpu_usage = psutil.cpu_percent(interval=None)  # Get CPU usage
            log_message = f"APM: {total_actions}, CPU Usage: {cpu_usage}%"
            print(log_message)
            log_with_dynamic_padding(log_message)  # Log the message to the file
            keystrokes = 0
            mouse_clicks = 0

# Start listeners
keyboard_listener = keyboard.Listener(on_press=on_key_press, on_release=on_key_release)
mouse_listener = mouse.Listener(on_click=on_click)

# Function to stop mouse listener
def stop_mouse_listener():
    mouse_listener.stop()  # Stops mouse listener explicitly

# Start listeners and threads
keyboard_listener.start()
mouse_listener.start()

# Start resource monitoring in a separate thread
thread = threading.Thread(target=monitor_resources, daemon=True)
thread.start()

try:
    # Join the keyboard listener
    keyboard_listener.join()

    # When keyboard listener stops, ensure mouse listener stops
    stop_mouse_listener()

    # Ensure the main thread exits after listeners stop
    print("Program terminated successfully.")
    sys.exit(0)
except KeyboardInterrupt:
    log_with_dynamic_padding("Program terminated by Ctrl+C")
    print("Program terminated by Ctrl+C.")
    sys.exit(0)