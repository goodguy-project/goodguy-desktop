backend-build:
	cd backend && source venv/Scripts/activate && make pack

frontend-build:
	cd frontend && npx react-scripts build

app-build:
	cd app && npx tsc app.ts && npx electron-builder

app-debug-1:
	cd frontend && npx react-scripts start

app-debug-2:
	cp .goodguy-desktop app/ -rf
	cd app && npm run debug

app-debug:
	echo "goodguy debug start"; \
	make app-debug-1 & \
	make app-debug-2 & \
	wait;

all-build-win:
#	make frontend-build
#	make backend-build
#	make app-build
	rm -rf goodguy-desktop/
	mkdir goodguy-desktop
	cp .goodguy-desktop goodguy-desktop/ -rf
	cp app/dist/win-unpacked goodguy-desktop/.goodguy-desktop -rf
	cd goodguy-desktop/.goodguy-desktop && mv win-unpacked goodguy-desktop-win32-x64
	cd goodguy-desktop && echo -e '@echo off\nstart .goodguy-desktop\goodguy-desktop-win32-x64\goodguy-desktop.exe' > goodguy-desktop.bat
