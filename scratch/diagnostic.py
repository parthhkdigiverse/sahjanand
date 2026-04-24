import os
import socket
from pathlib import Path

def diagnostic():
    print(f"Current Working Directory: {os.getcwd()}")
    env_path = Path(".env")
    if env_path.exists():
        print(".env file found")
        with open(env_path) as f:
            for line in f:
                if "HOST" in line:
                    print(f"Line from .env: {line.strip()}")
    else:
        print(".env file NOT found")
    
    print(f"os.environ['HOST']: {os.environ.get('HOST')}")
    print(f"os.environ['APP_HOST']: {os.environ.get('APP_HOST')}")
    print(f"os.environ['UVICORN_HOST']: {os.environ.get('UVICORN_HOST')}")
    
    hostname = socket.gethostname()
    ip_address = socket.gethostbyname(hostname)
    print(f"Hostname: {hostname}")
    print(f"Resolved IP: {ip_address}")

if __name__ == "__main__":
    diagnostic()
