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
                    parts = line.split("=", 1)
                    if len(parts) == 2:
                        key = parts[0].strip()
                        value = parts[1].strip().strip('"').strip("'")
                        os.environ[key] = value

def get_venv_python():
    """Find the Python executable inside the project's .venv."""
    venv_dir = Path(__file__).parent / ".venv"
    if os.name == 'nt':
        venv_python = venv_dir / "Scripts" / "python.exe"
    else:
        venv_python = venv_dir / "bin" / "python3"
    if venv_python.exists():
        return str(venv_python)
    # Fallback to the current interpreter
    return sys.executable

def run_app():
    start_time = time.time()
    load_env()
    
    backend_port = os.environ.get("BACKEND_PORT", "8002")
    frontend_port = os.environ.get("FRONTEND_PORT", "3535")
    
    # Default to 127.0.0.1 for local dev (0.0.0.0 causes EPERM on macOS)
    # Set APP_HOST=0.0.0.0 in .env on the server for external access
    app_host = os.environ.get("APP_HOST", "127.0.0.1")
    
    # Ensure HOST and UVICORN_HOST are also set to match
    os.environ["HOST"] = app_host
    os.environ["UVICORN_HOST"] = app_host

    print(f"Starting Sahjanand Application...")
    print(f"Binding to host: {app_host}")
    print(f"Backend URL: http://{app_host}:{backend_port}")
    print(f"Frontend URL: http://{app_host}:{frontend_port}")

    # Determine command for frontend
    frontend_runner = "npm"
    if shutil.which("bun"):
        frontend_runner = "bun"
    
    print(f"Using {frontend_runner} for frontend")

    # Platform specific flags
    is_windows = os.name == 'nt'
    creation_flags = 0
    if is_windows:
        creation_flags = subprocess.CREATE_NEW_PROCESS_GROUP

    # Start Backend (use venv Python so dependencies like uvicorn are available)
    python_exe = get_venv_python()
    print(f"Using Python: {python_exe}")
    backend_cmd = [python_exe, "-m", "uvicorn", "backend.app.main:app", "--host", app_host, "--port", backend_port]
    if os.environ.get("DEBUG", "False").lower() == "true":
        backend_cmd.append("--reload")

    print(f"Launching Backend: {' '.join(backend_cmd)}")
    backend_process = subprocess.Popen(
        backend_cmd,
        env=os.environ.copy(),
        creationflags=creation_flags
    )

    # Start Frontend
    frontend_cmd = [frontend_runner, "run", "dev", "--", "--port", frontend_port]
    # On server, also pass --host to bind to all interfaces
    if app_host == "0.0.0.0":
        frontend_cmd.extend(["--host", app_host])
    
    print(f"Launching Frontend: {' '.join(frontend_cmd)}")
    frontend_process = subprocess.Popen(
        frontend_cmd,
        cwd=str(Path(__file__).parent / "frontend"),
        env=os.environ.copy(),
        shell=is_windows, # Necessary on Windows for npm/bun
        creationflags=creation_flags
    )

    def signal_handler(sig, frame):
        print("\nShutting down applications...")
        
        if is_windows:
            # On Windows, we need to send the signal to the process group
            subprocess.call(['taskkill', '/F', '/T', '/PID', str(backend_process.pid)])
            subprocess.call(['taskkill', '/F', '/T', '/PID', str(frontend_process.pid)])
        else:
            backend_process.terminate()
            frontend_process.terminate()
            backend_process.wait()
            frontend_process.wait()
            
        print("Shutdown complete.")
        sys.exit(0)

    # Handle Ctrl+C
    signal.signal(signal.SIGINT, signal_handler)
    if not is_windows:
        signal.signal(signal.SIGTERM, signal_handler)

    # Check backend health periodically
    backend_checked = False
    
    try:
        while True:
            time.sleep(1)
            if backend_process.poll() is not None:
                print("Backend process terminated unexpectedly.")
                break
            if frontend_process.poll() is not None:
                print("Frontend process terminated unexpectedly.")
                break
                
            if not backend_checked and time.time() - start_time > 5:
                # Simple attempt to check if backend is listening
                import urllib.request
                try:
                    with urllib.request.urlopen(f"http://127.0.0.1:{backend_port}/health", timeout=1) as response:
                        if response.getcode() == 200:
                            print("Backend self-test: SUCCESS (Backend is responding)")
                            backend_checked = True
                except Exception:
                    # Might not be ready yet
                    pass
    except KeyboardInterrupt:
        pass
    finally:
        signal_handler(None, None)

if __name__ == "__main__":
    run_app()
