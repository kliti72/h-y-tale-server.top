@echo off
curl -X POST http://localhost:3000/servers/status/ping ^
  -H "Content-Type: application/json" ^
  -d "{\"secret_key\": \"secret_key_italiancraft_2024\", \"players_online\": 1100, \"players_max\": 100, \"is_online\": true, \"latency_ms\": 42}"
pause