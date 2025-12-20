# Git Setup Instructions

## Initial Setup

1. Create a new repository on GitHub (e.g., `gv-legacy-combined`)

2. Run these commands in Git Bash:

```bash
cd "C:\Users\serje\Documents\GV-Combined"

# Initialize git (if not already done)
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Combined GV Character Builder and Interactive Map"

# Set branch to main
git branch -M main

# Add remote repository (replace with your GitHub URL)
git remote add origin https://github.com/YOUR_USERNAME/gv-legacy-combined.git

# Push to GitHub
git push -u origin main
```

## Render Deployment

1. Go to Render Dashboard
2. Click "New +" → "Static Site"
3. Connect your GitHub repository
4. Settings:
   - **Name**: gv-legacy-combined (or your choice)
   - **Branch**: main
   - **Root Directory**: (leave empty)
   - **Build Command**: `echo "No build needed"`
   - **Publish Directory**: `.` (dot)
5. Click "Create Static Site"

The site will be available at: `https://your-site-name.onrender.com`


