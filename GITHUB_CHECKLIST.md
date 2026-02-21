# GitHub Push Checklist ✓

## Before You Start

- [ ] You have a GitHub account (create at https://github.com)
- [ ] Git is installed on your computer
- [ ] You're in the project directory (`C:\Users\harsh\Desktop\Vasundhara`)

---

## Method 1: Using PowerShell Script (Easiest)

### Step 1: Run the Script
```powershell
# Right-click on push-to-github.ps1
# Select "Run with PowerShell"

# OR in PowerShell:
.\push-to-github.ps1
```

### Step 2: Follow the Prompts
- Enter your name when asked
- Enter your email when asked
- Enter commit message (or press Enter for default)
- Create GitHub repository when prompted
- Enter repository URL
- Authenticate when pushing

**Done! ✓**

---

## Method 2: Manual Commands (Step by Step)

### Step 1: Open PowerShell
```powershell
# Navigate to project
cd C:\Users\harsh\Desktop\Vasundhara
```

### Step 2: Configure Git (First Time Only)
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 3: Initialize Git
```powershell
git init
```

### Step 4: Add Files
```powershell
git add .
```

### Step 5: Create Commit
```powershell
git commit -m "Initial commit: Vasundhara climate platform"
```

### Step 6: Create GitHub Repository
1. Go to https://github.com
2. Click "+" → "New repository"
3. Name: `vasundhara-climate-platform`
4. Description: "AI-powered climate action platform"
5. Choose Public or Private
6. **DO NOT** check "Initialize with README"
7. Click "Create repository"

### Step 7: Connect to GitHub
```powershell
# Replace with YOUR repository URL
git remote add origin https://github.com/yourusername/vasundhara-climate-platform.git
```

### Step 8: Push to GitHub
```powershell
git branch -M main
git push -u origin main
```

### Step 9: Authenticate
- Username: Your GitHub username
- Password: Use **Personal Access Token** (not your password!)

**Done! ✓**

---

## Method 3: Using GitHub Desktop (Easiest for Beginners)

### Step 1: Download GitHub Desktop
- Go to https://desktop.github.com/
- Download and install

### Step 2: Sign In
- Open GitHub Desktop
- File → Options → Sign in to GitHub.com
- Enter your credentials

### Step 3: Add Repository
- File → Add Local Repository
- Choose: `C:\Users\harsh\Desktop\Vasundhara`
- Click "Add Repository"

### Step 4: Create Initial Commit
- You'll see all your files listed
- Enter commit message: "Initial commit: Vasundhara climate platform"
- Click "Commit to main"

### Step 5: Publish to GitHub
- Click "Publish repository"
- Name: `vasundhara-climate-platform`
- Description: "AI-powered climate action platform"
- Choose Public or Private
- Click "Publish repository"

**Done! ✓**

---

## Creating Personal Access Token

### Why?
GitHub no longer accepts passwords for Git operations. You need a token.

### Steps:
1. Go to GitHub.com
2. Click your profile picture → **Settings**
3. Scroll down → **Developer settings**
4. **Personal access tokens** → **Tokens (classic)**
5. Click **"Generate new token (classic)"**
6. Name: "Vasundhara Project"
7. Expiration: Choose duration (90 days recommended)
8. Select scopes: Check **"repo"** (full control)
9. Click **"Generate token"**
10. **COPY THE TOKEN** (you won't see it again!)
11. Save it somewhere safe

### Using the Token:
When Git asks for password, paste the token instead.

---

## Verify Upload

After pushing, verify your files are on GitHub:

1. Go to your repository URL
2. Refresh the page
3. You should see:
   - ✓ Frontend/ folder
   - ✓ Backend/ folder
   - ✓ README.md
   - ✓ .gitignore
   - ✓ Documentation files

---

## Common Errors & Solutions

### Error: "fatal: not a git repository"
**Solution**: Run `git init` first

### Error: "failed to push some refs"
**Solution**:
```powershell
git pull origin main --rebase
git push origin main
```

### Error: "Permission denied"
**Solution**: Use Personal Access Token, not password

### Error: "remote origin already exists"
**Solution**:
```powershell
git remote remove origin
git remote add origin YOUR_REPO_URL
```

### Error: "refusing to merge unrelated histories"
**Solution**:
```powershell
git pull origin main --allow-unrelated-histories
git push origin main
```

---

## After Successful Push

### 1. Add Repository Description
- Go to your repository on GitHub
- Click "⚙️" next to About
- Add description: "AI-powered climate action platform with tree planting, CO₂ tracking, and marine debris detection"
- Add topics: `react-native`, `expo`, `flask`, `climate-tech`, `ai`, `tree-planting`
- Save

### 2. Add License
- Click "Add file" → "Create new file"
- Name: `LICENSE`
- Click "Choose a license template"
- Select "MIT License"
- Fill in your name
- Commit

### 3. Enable Issues
- Settings → Features
- Check "Issues"

### 4. Add Repository Image
- Settings → General
- Social preview → Upload image
- Use a screenshot of your app

---

## Future Updates

When you make changes to your code:

```powershell
# 1. Check what changed
git status

# 2. Add changes
git add .

# 3. Commit
git commit -m "Description of changes"

# 4. Push
git push
```

---

## Quick Reference

```powershell
# Check status
git status

# Add all files
git add .

# Commit
git commit -m "Your message"

# Push
git push

# Pull latest
git pull

# View history
git log

# Undo last commit (keep changes)
git reset --soft HEAD~1
```

---

## Need Help?

- **GitHub Docs**: https://docs.github.com
- **Git Cheat Sheet**: https://education.github.com/git-cheat-sheet-education.pdf
- **GitHub Desktop**: https://desktop.github.com/
- **Personal Access Token Guide**: https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token

---

**Choose the method that works best for you and follow the steps! 🚀**
