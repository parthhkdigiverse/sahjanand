import subprocess
import os
import signal
import sys
import time
from pathlib import Path

# Load .env file
def load_env():
    env_path = Path(__file__).parent / ".env"
    if env_path.exists():
        with open(env_path) as f:
            for line in f:
                if "=" in line and not line.startswith("#"):
                    key, value = line.strip().split("=", 1)
                    os.environ[key] = value

def run_app():
    load_env()
    
    backend_port = os.environ.get("BACKEND_PORT", "8001")
    frontend_port = os.environ.get("FRONTEND_PORT", "3535")

    print(f"🚀 Starting Sahjanand Application...")
    print(f"📦 Backend Port: {backend_port}")
    print(f"🎨 Frontend Port: {frontend_port}")

    # Start Backend
    backend_process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", backend_port, "--reload"],
        env=os.environ.copy()
    )

    # Start Frontend
    try:
        frontend_process = subprocess.Popen(
            ["npm", "run", "dev", "--", "--port", frontend_port],
            cwd=str(Path(__file__).parent / "frontend"),
            env=os.environ.copy(),
            shell=True
        )
    except FileNotFoundError:
        print("❌ Error: 'npm' was not found. Please ensure Node.js is installed.")
        backend_process.terminate()
        sys.exit(1)

    def signal_handler(sig, frame):
        print("\n🛑 Shutting down applications...")
        backend_process.terminate()
        frontend_process.terminate()
        backend_process.wait()
        frontend_process.wait()
        print("✅ Shutdown complete.")
        sys.exit(0)

    signal.signal(signal.SIGINT, signal_handler)
    signal.signal(signal.SIGTERM, signal_handler)

    try:
        while True:
            time.sleep(1)
            if backend_process.poll() is not None:
                print("❌ Backend process terminated unexpectedly.")
                break
            if frontend_process.poll() is not None:
                print("❌ Frontend process terminated unexpectedly.")
                break
    except KeyboardInterrupt:
        pass
    finally:
        signal_handler(None, None)

if __name__ == "__main__":
    run_app()
