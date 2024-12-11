import asyncio
import websockets
import json

# Set of connected clients
connected_clients = set()

async def handle_client(websocket, path=None):
    # Add this client to the connected clients
    connected_clients.add(websocket)
    try:
        async for message in websocket:
            print(f"Received message: {message}")
            # Broadcast the message to all connected clients
            for client in connected_clients:
                if client != websocket:
                    await client.send(message)
    except websockets.exceptions.ConnectionClosed:
        print("Client connection closed")
    finally:
        # Remove the client when connection is closed
        connected_clients.remove(websocket)

async def main():
    # Create WebSocket server with the updated handler
    server = await websockets.serve(handle_client, "localhost", 8765)
    print("WebSocket server started on ws://localhost:8765")
    
    # Keep the server running
    await server.wait_closed()

# Run the server
if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("WebSocket server stopped")