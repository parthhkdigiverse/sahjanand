import subprocess
import os
import signal
import sys
import time
import shutil
from pathlib import Path

# Load .env file manually to avoid dependencies
def load_env():
    env_path = Path(__file__).parent / ".env"
    if env_path.exists():
        with open(env_path, encoding='utf-8') as f:
            for line in f:
                line = line.strip()
                if "=" in line and not line.startswith("#"):
                    key, value = line.split("=", 1)
                    # Remove potential quotes
                    value = value.strip().strip('"').strip("'")
                    os.environ[key] = value

def run_app():
    load_env()
    
    backend_port = os.environ.get("BACKEND_PORT", "8001")
    frontend_port = os.environ.get("FRONTEND_PORT", "3535")

    print(f"🚀 Starting Sahjanand Application...")
    print(f"📦 Backend Port: {backend_port}")
    print(f"🎨 Frontend Port: {frontend_port}")

    # Determine command for frontend
    frontend_runner = "npm"
    if shutil.which("bun"):
        frontend_runner = "bun"
    
    print(f"🛠️  Using {frontend_runner} for frontend")

    # Platform specific flags
    is_windows = os.name == 'nt'
    creation_flags = 0
    if is_windows:
        creation_flags = subprocess.CREATE_NEW_PROCESS_GROUP

    # Start Backend
    backend_cmd = [sys.executable, "-m", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", backend_port, "--reload"]
    backend_process = subprocess.Popen(
        backend_cmd,
        env=os.environ.copy(),
        creationflags=creation_flags
    )

    # Start Frontend
    # On Windows, we use shell=True for npm/bun as they are scripts
    frontend_cmd = [frontend_runner, "run", "dev"]
    # Pass port to frontend as well just in case config doesn't pick it up
    if frontend_runner == "npm":
        frontend_cmd += ["--", "--port", frontend_port]
    else:
        frontend_cmd += ["--port", frontend_port]

    frontend_process = subprocess.Popen(
        frontend_cmd,
        cwd=str(Path(__file__).parent / "frontend"),
        env=os.environ.copy(),
        shell=is_windows,
        creationflags=creation_flags
    )

    def signal_handler(sig, frame):
        print("\n🛑 Shutting down applications...")
        
        if is_windows:
            # On Windows, we need to send the signal to the process group
            subprocess.call(['taskkill', '/F', '/T', '/PID', str(backend_process.pid)])
            subprocess.call(['taskkill', '/F', '/T', '/PID', str(frontend_process.pid)])
        else:
            backend_process.terminate()
            frontend_process.terminate()
            backend_process.wait()
            frontend_process.wait()
            
        print("✅ Shutdown complete.")
        sys.exit(0)

    # Handle Ctrl+C
    signal.signal(signal.SIGINT, signal_handler)
    if not is_windows:
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
