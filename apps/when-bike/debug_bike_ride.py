
import os
import sys
from datetime import datetime

def check_environment():
    """Check environment settings and configuration"""
    print("=== Environment Diagnostic ===", flush=True)
    print(f"Current time: {datetime.now()}", flush=True)
    print(f"Python version: {sys.version}", flush=True)
    print(f"Script location: {os.path.abspath(__file__)}", flush=True)
    print(f"Current working directory: {os.getcwd()}", flush=True)
    
    # Check for .env file
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
    if os.path.exists(env_path):
        print(f".env file exists at: {env_path}", flush=True)
        try:
            with open(env_path, 'r') as f:
                content = f.read()
                # Don't print actual values, just report structure
                print(f".env file has {len(content)} characters and {content.count('=')} key-value pairs", flush=True)
        except Exception as e:
            print(f"Error reading .env file: {e}", flush=True)
    else:
        print(f"ERROR: .env file NOT found at: {env_path}", flush=True)
        
    # Check for API keys in environment
    vc_key = os.getenv('VISUAL_CROSSING_API_KEY')
    gemini_key = os.getenv('GEMINI_API_KEY')
    
    print(f"VISUAL_CROSSING_API_KEY found: {'Yes' if vc_key else 'No'}", flush=True)
    print(f"GEMINI_API_KEY found: {'Yes' if gemini_key else 'No'}", flush=True)
    
    # Check output directory
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(script_dir, 'output')
    print(f"Output directory: {output_dir}", flush=True)
    print(f"Output directory exists: {os.path.exists(output_dir)}", flush=True)
    if os.path.exists(output_dir):
        try:
            print(f"Output directory is writable: {os.access(output_dir, os.W_OK)}", flush=True)
            print(f"Files in output directory: {os.listdir(output_dir)}", flush=True)
        except Exception as e:
            print(f"Error checking output directory: {e}", flush=True)

if __name__ == "__main__":
    try:
        print("Starting diagnostic...", flush=True)
        check_environment()
        print("Diagnostic completed.", flush=True)
    except Exception as e:
        print(f"Diagnostic failed with error: {e}", flush=True)