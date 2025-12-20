# Gloria Victis Legacy Tools

Combined static site containing:
- **Character Builder** (root `/`)
- **Interactive Map** (`/map/`)

## Deployment

This is a static site ready for Render deployment.

### Render Setup

1. Connect this repository to Render
2. Service Type: **Web Service**
3. Environment: **Static Site**
4. Build Command: `echo "No build needed"`
5. Publish Directory: `.` (root)

The site will be available at your Render URL with:
- Character Builder at: `https://your-site.onrender.com/`
- Interactive Map at: `https://your-site.onrender.com/map/`
