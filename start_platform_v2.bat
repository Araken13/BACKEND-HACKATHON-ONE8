@echo off
echo Iniciando ChurnInsight V2 - Full System
echo =======================================

echo 1. Iniciando Microservico Python (IA REAL V4)...
start "Python IA Service" cmd /k "py -3.13 api_v2_real.py"

echo 2. Aguardando 5 segundos para o Python subir...
timeout /t 5 /nobreak >nul

echo 3. Iniciando Backend NestJS...
cd backend_v2
start "NestJS Backend" cmd /k "npm run start:dev"
cd ..

echo 4. Aguardando 10 segundos para o NestJS subir...
timeout /t 10 /nobreak >nul

echo 5. Iniciando Frontend Vite...
cd frontend_v2
start "Frontend React" cmd /k "npm run dev -- --host"
cd ..

echo =======================================
echo SISTEMA INICIADO!
echo Frontend: http://localhost:5173
echo Backend Doc: http://localhost:3000/api
echo =======================================
pause
