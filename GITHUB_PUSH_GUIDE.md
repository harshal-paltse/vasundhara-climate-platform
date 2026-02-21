# How to Push Vasundhara to GitHub

## Step-by-Step Guide

### Step 1: Create a GitHub Account (if you don't have one)
1. Go to https://github.com
2. Click "Sign up"
3. Follow the registration process

### Step 2: Create a New Repository on GitHub
1. Log in to GitHub
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the details:
   - **Repository name**: `vasundhara-climate-platform`
   - **Description**: "AI-powered climate action platform with tree planting, CO₂ tracking, and marine debris detection"
   - **Visibility**: Choose Public or Private
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
5. Click "Create repository"

### Step 3: Prepare Your Project

#### A. Update .gitignore (Important!)
Make sure sensitive files are not pushed:

```bash
# Check if .gitignore exists
cat .gitignore
```

Your .gitignore should include:
```
# Dependencies
node_modules/
Frontend/node_modules/

# Expo
.expo/
Frontend/.expo/
dist/
web-build/

# Database (optional - remove if you want to push it)
Backend/trees.db
Backend/*.db

# Environment variables
.env
.env.local

# OS files
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/

# Logs
npm-debug.*
*.log

# Python
__pycache__/
*.pyc
*.pyo
Backend/__pycache__/

# Build files
*.apk
*.ipa
*.aab
```

### Step 4: Initialize Git (if not already done)

Open PowerShell in your project root directory:

```powershell
# Navigate to project directory
cd C:\Users\harsh\Desktop\Vasundhara

# Check if git is already initialized
git status
```

If you see "fatal: not a git repository", initialize git:

```powershell
# Initialize git repository
git init

# Check status
git status
```

### Step 5: Configure Git (First Time Only)

```powershell
# Set your name
git config --global user.name "Your Name"

# Set your email (use your GitHub email)
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
```

### Step 6: Add Files to Git

```powershell
# Add all files (respects .gitignore)
git add .

# Check what will be committed
git status

# If you see files you don't want to commit, add them to .gitignore
# Then run: git rm --cached <filename>
```

### Step 7: Create First Commit

```powershell
# Create commit with descriptive message
git commit -m "Initial commit: Vasundhara climate platform with tree planting, CO2 tracking, and AI detection"

# Verify commit
git log
```

### Step 8: Connect to GitHub Repository

After creating the repository on GitHub, you'll see a URL like:
`https://github.com/yourusername/vasundhara-climate-platform.git`

```powershell
# Add remote repository
git remote add origin https://github.com/yourusername/vasundhara-climate-platform.git

# Verify remote
git remote -v
```

### Step 9: Push to GitHub

```powershell
# Push to main branch
git push -u origin main

# If you get an error about 'master' vs 'main', try:
git branch -M main
git push -u origin main
```

### Step 10: Authenticate with GitHub

When you push, you'll be asked to authenticate. You have two options:

#### Option A: Personal Access Token (Recommended)
1. Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Give it a name: "Vasundhara Project"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)
7. When prompted for password, paste the token

#### Option B: GitHub Desktop (Easier)
1. Download GitHub Desktop: https://desktop.github.com/
2. Install and sign in
3. File → Add Local Repository
4. Select your Vasundhara folder
5. Click "Publish repository"

### Step 11: Verify Upload

1. Go to your GitHub repository URL
2. Refresh the page
3. You should see all your files!

---

## Quick Command Reference

```powershell
# Check status
git status

# Add specific file
git add filename.js

# Add all files
git add .

# Commit changes
git commit -m "Your message here"

# Push to GitHub
git push

# Pull latest changes
git pull

# View commit history
git log

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main
```

---

## Common Issues & Solutions

### Issue 1: "fatal: not a git repository"
**Solution**: Run `git init` in your project root

### Issue 2: "failed to push some refs"
**Solution**: 
```powershell
git pull origin main --rebase
git push origin main
```

### Issue 3: "Permission denied"
**Solution**: Use Personal Access Token instead of password

### Issue 4: Large files error
**Solution**: Add large files to .gitignore
```powershell
# Remove from git but keep locally
git rm --cached path/to/large/file
```

### Issue 5: Wrong files committed
**Solution**:
```powershell
# Undo last commit (keep changes)
git reset --soft HEAD~1

# Update .gitignore
# Add files again
git add .
git commit -m "Fixed commit"
```

---

## Best Practices

### 1. Write Good Commit Messages
```powershell
# Bad
git commit -m "fixed stuff"

# Good
git commit -m "Fix: Resolved fetchPlantedTrees error in PlantTreeScreen"
```

### 2. Commit Often
- Commit after completing a feature
- Commit before making major changes
- Commit at the end of each work session

### 3. Use Branches for Features
```powershell
# Create feature branch
git checkout -b feature/badge-system

# Work on feature...
git add .
git commit -m "Add badge system"

# Merge back to main
git checkout main
git merge feature/badge-system
```

### 4. Keep .gitignore Updated
Never commit:
- `node_modules/`
- `.env` files
- Database files (unless intentional)
- API keys
- Build artifacts

---

## Create a Great README.md

Your repository should have a README.md file:

```markdown
# 🌳 Vasundhara - Climate Action Platform

AI-powered environmental intelligence platform for climate action.

## Features
- 🌳 GPS-validated tree planting
- 🔥 Daily streak tracking
- 🏆 Achievement badges
- 📊 CO₂ footprint calculator
- 🤖 Marine debris AI detection
- 🌊 River pollution monitoring
- 🎨 Dark/Light theme support

## Tech Stack
- **Frontend**: React Native (Expo)
- **Backend**: Flask (Python)
- **Database**: SQLite
- **AI**: Marine debris detection model

## Installation

### Backend
\`\`\`bash
cd Backend
pip install flask flask-cors
python app.py
\`\`\`

### Frontend
\`\`\`bash
cd Frontend
npm install
npm start
\`\`\`

## API Endpoints
- `POST /plant` - Plant a tree
- `GET /trees` - Get all trees
- `GET /streak/<user_id>` - Get user streak
- `GET /badges/<user_id>` - Get user badges
- `POST /co2-complete` - Award CO₂ badge
- `POST /predict` - Marine debris detection

## Screenshots
[Add screenshots here]

## License
MIT

## Author
[Your Name]
\`\`\`

---

## After Pushing

### 1. Add Topics to Repository
On GitHub repository page:
- Click "⚙️ Settings"
- Add topics: `react-native`, `expo`, `flask`, `climate-tech`, `environmental`, `ai`, `tree-planting`

### 2. Add Repository Description
- Click "⚙️ Settings"
- Add description: "AI-powered climate action platform with tree planting, CO₂ tracking, and marine debris detection"

### 3. Enable GitHub Pages (Optional)
- Settings → Pages
- Deploy documentation or demo

### 4. Add License
- Add file → Create new file
- Name: `LICENSE`
- Choose template: MIT License

---

## Updating Your Repository

When you make changes:

```powershell
# 1. Check what changed
git status

# 2. Add changes
git add .

# 3. Commit with message
git commit -m "Add: Implemented streak badge system"

# 4. Push to GitHub
git push
```

---

## Collaboration

To allow others to contribute:

1. **Settings** → **Collaborators**
2. Add collaborators by username
3. They can clone your repository:
```powershell
git clone https://github.com/yourusername/vasundhara-climate-platform.git
```

---

## Need Help?

- GitHub Docs: https://docs.github.com
- Git Cheat Sheet: https://education.github.com/git-cheat-sheet-education.pdf
- GitHub Desktop: https://desktop.github.com/

---

**You're ready to push your project to GitHub! 🚀**
