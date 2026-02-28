@echo off
echo Creating missing directories...
mkdir config 2>nul
mkdir middleware 2>nul
mkdir routes 2>nul

echo Creating missing files...

:: Create database.js
echo import pkg from 'pg'; > config\database.js
echo const { Pool } = pkg; >> config\database.js
echo import dotenv from 'dotenv'; >> config\database.js
echo. >> config\database.js
echo dotenv.config(); >> config\database.js
echo. >> config\database.js
echo const pool = new Pool({ >> config\database.js
echo   host: process.env.DB_HOST, >> config\database.js
echo   port: process.env.DB_PORT, >> config\database.js
echo   database: process.env.DB_NAME, >> config\database.js
echo   user: process.env.DB_USER, >> config\database.js
echo   password: process.env.DB_PASSWORD, >> config\database.js
echo }); >> config\database.js
echo. >> config\database.js
echo export default pool; >> config\database.js

:: Create auth.js
echo import jwt from 'jsonwebtoken'; > middleware\auth.js
echo import dotenv from 'dotenv'; >> middleware\auth.js
echo. >> middleware\auth.js
echo dotenv.config(); >> middleware\auth.js
echo. >> middleware\auth.js
echo export const authenticateToken = (req, res, next) => { >> middleware\auth.js
echo   const authHeader = req.headers['authorization']; >> middleware\auth.js
echo   const token = authHeader && authHeader.split(' ')[1]; >> middleware\auth.js
echo. >> middleware\auth.js
echo   if (!token) { >> middleware\auth.js
echo     return res.status(401).json({ message: 'Access token required' }); >> middleware\auth.js
echo   } >> middleware\auth.js
echo. >> middleware\auth.js
echo   jwt.verify(token, process.env.JWT_SECRET, (err, user) => { >> middleware\auth.js
echo     if (err) { >> middleware\auth.js
echo       return res.status(403).json({ message: 'Invalid token' }); >> middleware\auth.js
echo     } >> middleware\auth.js
echo     req.user = user; >> middleware\auth.js
echo     next(); >> middleware\auth.js
echo   }); >> middleware\auth.js
echo }; >> middleware\auth.js
echo. >> middleware\auth.js
echo export const requireAdmin = (req, res, next) => { >> middleware\auth.js
echo   if (req.user.role !== 'admin') { >> middleware\auth.js
echo     return res.status(403).json({ message: 'Admin access required' }); >> middleware\auth.js
echo   } >> middleware\auth.js
echo   next(); >> middleware\auth.js
echo }; >> middleware\auth.js

echo Setup complete! Try running 'npm run dev' again.
pause