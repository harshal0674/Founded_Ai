import os
import sys

_curr = os.path.dirname(os.path.abspath(__file__))
_parent = os.path.dirname(_curr)
if _curr not in sys.path:
    sys.path.insert(0, _curr)
if _parent not in sys.path:
    sys.path.insert(0, _parent)

from backend.app.main import app

if __name__ == "__main__":
    import uvicorn
    port = int(os.environ.get("PORT", 8000))
    host = os.environ.get("HOST", "0.0.0.0")
    uvicorn.run(app, host=host, port=port)
