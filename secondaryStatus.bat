@echo off
curl -X POST http://localhost:3000/servers/status/ping/secondary ^
  -H "Content-Type: application/json" ^
  -d "{\"secret_key\": \"303c547d-2454-4bd4-9180-73588f6f4a59\", \"secondary_id\": \"survival-2\", \"players_online\": 30}"
pause