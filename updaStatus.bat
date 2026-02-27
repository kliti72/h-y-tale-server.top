@echo off
curl -X POST http://localhost:3000/servers/status/ping ^
  -H "Content-Type: application/json" ^
  -d "{\"secret_key\": \"303c547d-2454-4bd4-9180-73588f6f4a59\", \"players_online\": 50, \"players_max\": 100, \"is_online\": true, \"latency_ms\": 42}"
pause