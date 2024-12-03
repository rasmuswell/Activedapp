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
    except websockets.exceptions.ConnectionClosed as e:
        print(f"Client connection closed: {e.code}, {e.reason}")
        # Notify other clients about disconnection
        disconnect_message = json.dumps({
            "type": "disconnect",
            "message": "Collecting tool closed."
        })
        await asyncio.gather(
            *[client.send(disconnect_message) for client in connected_clients if client != websocket],
            return_exceptions=True
        )
    finally:
        # Remove the client when connection is closed
        connected_clients.remove(websocket)
        print(f"Client removed. Remaining clients: {len(connected_clients)}")

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
