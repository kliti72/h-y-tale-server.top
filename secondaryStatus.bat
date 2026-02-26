@echo off
curl -X POST http://localhost:3000/servers/status/ping/secondary ^
  -H "Content-Type: application/json" ^
  -d "{\"secret_key\": \"33e99620-73f3-40b4-a091-c426192b5c65\", \"secondary_id\": \"survival-1\", \"players_online\": 30}"
pause