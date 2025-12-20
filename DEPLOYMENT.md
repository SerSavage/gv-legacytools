# Deployment Guide - Combined GV Legacy Site

## Structure

```
GV-Combined/
├── index.html              # Character Builder (root)
├── index_files/            # Character Builder assets
├── map/
│   ├── index.html          # Interactive Map
│   ├── GVmaptiles/         # Map tile images
│   └── MapZones.png        # Zones overlay image
├── static.json             # Render static site config
├── render.yaml             # Render blueprint
└── README.md
```

## URLs After Deployment

- **Character Builder**: `https://your-site.onrender.com/`
- **Interactive Map**: `https://your-site.onrender.com/map/`

## Render Setup Steps

1. **Push to GitHub**
   - Create a new repository on GitHub (e.g., `gv-legacy-combined`)
   - Follow instructions in `GIT-SETUP.md`

2. **Deploy on Render**
   - Go to [Render Dashboard](https://dashboard.render.com)
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `gv-legacy-combined` (or your choice)
     - **Branch**: `main`
     - **Root Directory**: (leave empty)
     - **Build Command**: `echo "No build needed"`
     - **Publish Directory**: `.` (dot)
   - Click "Create Static Site"

3. **Wait for Deployment**
   - First deployment takes 2-3 minutes
   - Subsequent updates are faster

## Testing

After deployment, test:
- ✅ Character Builder loads at root URL
- ✅ Interactive Map loads at `/map/`
- ✅ Navigation links work between pages
- ✅ Map tiles load correctly
- ✅ Zones overlay works

## Notes

- Both tools work independently
- Shared navigation menu at top
- All assets use relative paths
- No backend required - pure static site


