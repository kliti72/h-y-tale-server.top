@echo off
curl -X POST http://localhost:3000/servers/status/ping ^
  -H "Content-Type: application/json" ^
  -d "{\"secret_key\": \"33e99620-73f3-40b4-a091-c426192b5c65\", \"players_online\": 1100, \"players_max\": 100, \"is_online\": true, \"latency_ms\": 42}"
pause