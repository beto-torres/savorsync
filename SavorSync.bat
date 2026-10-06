```bat
@echo off
title SavorSync
color 0F
mode con: cols=62 lines=25

cd /d "C:\dev\expoete\savorsync"

:MENU
color 0F
cls
echo.
echo       +------------------------------------------------+
echo       ^|                                                ^|
echo       ^|                  SavorSync                     ^|
echo       ^|                                                ^|
echo       ^|          Gerenciador do Sistema                ^|
echo       ^|                                                ^|
echo       +------------------------------------------------+
echo.
echo.
echo             [ 1 ]  Iniciar o sistema
echo.
echo             [ 2 ]  Encerrar o sistema
echo.
echo             [ 3 ]  Verificar funcionamento
echo.
echo             [ 4 ]  Atualizar o sistema
echo.
echo             [ 5 ]  Sair
echo.
echo.
echo       --------------------------------------------------
echo.
set /p opcao="             O que voce deseja fazer? "

if "%opcao%"=="1" goto INICIAR
if "%opcao%"=="2" goto PARAR
if "%opcao%"=="3" goto STATUS
if "%opcao%"=="4" goto RECONSTRUIR
if "%opcao%"=="5" goto SAIR

cls
echo.
echo.
echo                 Opcao nao encontrada.
echo.
echo          Escolha uma opcao entre 1 e 5.
echo.
timeout /t 2 >nul
goto MENU


:INICIAR
cls
echo.
echo       +------------------------------------------------+
echo       ^|                  SavorSync                     ^|
echo       +------------------------------------------------+
echo.
echo.
echo              Estamos iniciando o sistema.
echo.
echo                 Aguarde um momento...
echo.
echo       --------------------------------------------------
echo.

docker compose -f compose.yaml up -d

echo.
echo       --------------------------------------------------
echo.
echo.
echo               Tudo pronto para comecar!
echo.
echo             O sistema foi iniciado.
echo.
echo.
echo                    [ PRONTO ]
echo.
echo.
echo             Pressione uma tecla para voltar.
pause >nul
goto MENU


:PARAR
cls
echo.
echo       +------------------------------------------------+
echo       ^|                  SavorSync                     ^|
echo       +------------------------------------------------+
echo.
echo.
echo              Estamos encerrando o sistema.
echo.
echo                 Aguarde um momento...
echo.
echo       --------------------------------------------------
echo.

docker compose -f compose.yaml down

echo.
echo       --------------------------------------------------
echo.
echo.
echo                  Tudo certo!
echo.
echo            O sistema foi encerrado com
echo               seguranca e sucesso.
echo.
echo.
echo                    [ PRONTO ]
echo.
echo.
echo             Pressione uma tecla para voltar.
pause >nul
goto MENU


:STATUS
cls
echo.
echo       +------------------------------------------------+
echo       ^|                  SavorSync                     ^|
echo       +------------------------------------------------+
echo.
echo.
echo            Verificando o funcionamento...
echo.
echo.

docker compose -f compose.yaml ps

echo.
echo.
echo       --------------------------------------------------
echo.
echo             Verificacao concluida.
echo.
echo             Pressione uma tecla para voltar.
pause >nul
goto MENU


:RECONSTRUIR
cls
echo.
echo       +------------------------------------------------+
echo       ^|                  SavorSync                     ^|
echo       +------------------------------------------------+
echo.
echo.
echo              Estamos atualizando o sistema.
echo.
echo              Isso pode levar alguns minutos.
echo.
echo                 Aguarde um momento...
echo.
echo       --------------------------------------------------
echo.

docker compose -f compose.yaml up -d --build

echo.
echo       --------------------------------------------------
echo.
echo.
echo                  Atualizacao concluida!
echo.
echo               O SavorSync esta pronto
echo                  para ser utilizado.
echo.
echo.
echo                    [ PRONTO ]
echo.
echo.
echo             Pressione uma tecla para voltar.
pause >nul
goto MENU


:SAIR
cls
echo.
echo.
echo.
echo                  Ate a proxima!
echo.
echo              Encerrando o SavorSync...
echo.
timeout /t 2 >nul
exit
```