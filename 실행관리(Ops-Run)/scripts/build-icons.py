"""Build the frontend icon bundle from the illustrated catalog."""
import subprocess
from pathlib import Path

subprocess.run(["node", str(Path(__file__).with_name("build-ui-icons.mjs"))], check=True)
