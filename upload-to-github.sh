#!/bin/bash
# Upload Combined GV Legacy Site to GitHub

echo "=== Uploading Combined GV Legacy Site to GitHub ==="

# Navigate to the folder
cd "$(dirname "$0")"

# Initialize git (if not already done)
if [ ! -d .git ]; then
    git init
    echo "Git repository initialized"
fi

# Add all files
git add .

# Create commit
git commit -m "Initial commit: Combined GV Character Builder and Interactive Map"

# Set branch to main
git branch -M main

# Add remote repository (user will need to set this)
echo ""
echo "Please add your GitHub repository URL:"
echo "Example: git remote add origin https://github.com/YOUR_USERNAME/gv-legacy-combined.git"
echo ""
echo "Then run: git push -u origin main"

