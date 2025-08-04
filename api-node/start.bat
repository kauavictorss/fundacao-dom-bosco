@echo off
echo ========================================
echo Instalando dependencias do Node.js...
echo ========================================
cd /d "C:\Projetos\fundacao-dom-bosco\api-node"

echo Instalando express...
npm install express

echo Instalando pg (PostgreSQL)...
npm install pg

echo Instalando cors...
npm install cors

echo Instalando dotenv...
npm install dotenv

echo.
echo ========================================
echo Dependencias instaladas! Iniciando servidor...
echo ========================================
echo.
echo API rodara na porta 3002 conforme configurado no .env
node server.js
