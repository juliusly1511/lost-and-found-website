@echo off
echo Fixing client setup...

echo Checking package.json...
if not exist package.json (
    echo Creating package.json...
    echo { > package.json
    echo   "name": "lost-found-frontend", >> package.json
    echo   "version": "1.0.0", >> package.json
    echo   "type": "module", >> package.json
    echo   "scripts": { >> package.json
    echo     "dev": "vite", >> package.json
    echo     "build": "vite build", >> package.json
    echo     "preview": "vite preview" >> package.json
    echo   }, >> package.json
    echo   "dependencies": { >> package.json
    echo     "react": "^18.2.0", >> package.json
    echo     "react-dom": "^18.2.0", >> package.json
    echo     "react-router-dom": "^6.15.0", >> package.json
    echo     "axios": "^1.5.0" >> package.json
    echo   }, >> package.json
    echo   "devDependencies": { >> package.json
    echo     "@vitejs/plugin-react": "^4.0.4", >> package.json
    echo     "vite": "^4.4.5" >> package.json
    echo   } >> package.json
    echo } >> package.json
)

echo Creating vite.config.js...
echo import { defineConfig } from 'vite' > vite.config.js
echo import react from '@vitejs/plugin-react' >> vite.config.js
echo. >> vite.config.js
echo export default defineConfig({ >> vite.config.js
echo   plugins: [react()], >> vite.config.js
echo   server: { >> vite.config.js
echo     port: 3000, >> vite.config.js
echo     proxy: { >> vite.config.js
echo       '/api': { >> vite.config.js
echo         target: 'http://localhost:5000', >> vite.config.js
echo         changeOrigin: true >> vite.config.js
echo       } >> vite.config.js
echo     } >> vite.config.js
echo   } >> vite.config.js
echo }) >> vite.config.js

echo Creating index.html...
echo ^<!DOCTYPE html^> > index.html
echo ^<html lang="en"^> >> index.html
echo   ^<head^> >> index.html
echo     ^<meta charset="UTF-8" /^> >> index.html
echo     ^<link rel="icon" type="image/svg+xml" href="/vite.svg" /^> >> index.html
echo     ^<meta name="viewport" content="width=device-width, initial-scale=1.0" /^> >> index.html
echo     ^<title^>Lost ^& Found App^</title^> >> index.html
echo   ^</head^> >> index.html
echo   ^<body^> >> index.html
echo     ^<div id="root"^>^</div^> >> index.html
echo     ^<script type="module" src="/src/main.jsx"^>^</script^> >> index.html
echo   ^</body^> >> index.html
echo ^</html^> >> index.html

echo Installing dependencies...
npm install

echo Client setup complete! Now run 'npm run dev'
pause