import subprocess
import sys
import tempfile
import os

def run_python(code):
    try:
        # Create a temp file
        with tempfile.NamedTemporaryFile(delete=False, suffix=".py") as temp_file:
            temp_file.write(code.encode())
            temp_file_path = temp_file.name

        # Run the code in subprocess
        result = subprocess.run(
            [sys.executable, temp_file_path],
            capture_output=True,
            text=True,
            timeout=5  # 5 seconds max
        )

        # Clean up temp file
        os.remove(temp_file_path)

        if result.returncode == 0:
            return {"success": True, "output": result.stdout}
        else:
            return {"success": False, "error": result.stderr}

    except subprocess.TimeoutExpired:
        return {"success": False, "error": "Execution timed out!"}
    except Exception as e:
        return {"success": False, "error": str(e)}
