@echo off
echo Starting Deployment...

git init
git branch -m main
git add .
git commit -m "Auto Deploy"
git remote add origin https://github.com/c01079173153-maker/lms-platform.git
git branch -M main
git push -u origin main

echo Done!
pause
