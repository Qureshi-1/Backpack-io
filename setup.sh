#!/bin/bash

echo "🚀 Backpack Repository Setup Script initializing..."

# Check if git is already initialized
if [ ! -d ".git" ]; then
  git init
  echo "✅ Git repository initialized."
else
  echo "ℹ️ Git repository already exists."
fi

# Add .gitignore ignores for node_modules, venv, pycache, etc.
cat <<EOL >> .gitignore

# Python Setup ignored files
node_modules/
venv/
__pycache__/
*.pyc

# Next.js specific
.next/

# Standard Ignores
.DS_Store
.env.local
npm-debug.log
EOL

echo "✅ Appended ignoring patterns to .gitignore"

# Add all files to staging
git add .
echo "✅ Added files to staging area."

# Commit all changes
git commit -m "Initial commit"
echo "🎉 Initial commit successful!"

echo ""
echo "🔥 We're ready! Run 'git push origin main' when connected to remote."
