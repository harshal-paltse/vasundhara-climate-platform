# Vasundhara - GitHub Push Script
# Run this script to push your project to GitHub

Write-Host "🌳 Vasundhara - GitHub Push Helper" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green
Write-Host ""

# Check if git is installed
Write-Host "Checking if Git is installed..." -ForegroundColor Yellow
try {
    $gitVersion = git --version
    Write-Host "✓ Git is installed: $gitVersion" -ForegroundColor Green
} catch {
    Write-Host "✗ Git is not installed!" -ForegroundColor Red
    Write-Host "Please install Git from: https://git-scm.com/download/win" -ForegroundColor Yellow
    exit
}

Write-Host ""

# Check if already initialized
Write-Host "Checking Git status..." -ForegroundColor Yellow
$gitStatus = git status 2>&1

if ($gitStatus -like "*not a git repository*") {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "✓ Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "✓ Git repository already initialized" -ForegroundColor Green
}

Write-Host ""

# Configure Git (if not configured)
Write-Host "Checking Git configuration..." -ForegroundColor Yellow
$userName = git config user.name
$userEmail = git config user.email

if (-not $userName) {
    Write-Host "Git user name not configured." -ForegroundColor Yellow
    $name = Read-Host "Enter your name"
    git config --global user.name "$name"
    Write-Host "✓ User name configured" -ForegroundColor Green
}

if (-not $userEmail) {
    Write-Host "Git email not configured." -ForegroundColor Yellow
    $email = Read-Host "Enter your email (use your GitHub email)"
    git config --global user.email "$email"
    Write-Host "✓ Email configured" -ForegroundColor Green
}

Write-Host ""
Write-Host "Current Git Configuration:" -ForegroundColor Cyan
Write-Host "Name: $(git config user.name)" -ForegroundColor White
Write-Host "Email: $(git config user.email)" -ForegroundColor White
Write-Host ""

# Add files
Write-Host "Adding files to Git..." -ForegroundColor Yellow
git add .
Write-Host "✓ Files added" -ForegroundColor Green
Write-Host ""

# Show status
Write-Host "Files to be committed:" -ForegroundColor Cyan
git status --short
Write-Host ""

# Commit
$commitMessage = Read-Host "Enter commit message (or press Enter for default)"
if (-not $commitMessage) {
    $commitMessage = "Initial commit: Vasundhara climate platform"
}

Write-Host "Creating commit..." -ForegroundColor Yellow
git commit -m "$commitMessage"
Write-Host "✓ Commit created" -ForegroundColor Green
Write-Host ""

# Check for remote
$remotes = git remote
if (-not $remotes) {
    Write-Host "No remote repository configured." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please follow these steps:" -ForegroundColor Cyan
    Write-Host "1. Go to https://github.com" -ForegroundColor White
    Write-Host "2. Click '+' → 'New repository'" -ForegroundColor White
    Write-Host "3. Name: vasundhara-climate-platform" -ForegroundColor White
    Write-Host "4. DO NOT initialize with README" -ForegroundColor White
    Write-Host "5. Click 'Create repository'" -ForegroundColor White
    Write-Host ""
    
    $repoUrl = Read-Host "Enter your GitHub repository URL (e.g., https://github.com/username/repo.git)"
    
    Write-Host "Adding remote repository..." -ForegroundColor Yellow
    git remote add origin $repoUrl
    Write-Host "✓ Remote added" -ForegroundColor Green
} else {
    Write-Host "✓ Remote repository already configured" -ForegroundColor Green
    git remote -v
}

Write-Host ""

# Rename branch to main if needed
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    Write-Host "Renaming branch to 'main'..." -ForegroundColor Yellow
    git branch -M main
    Write-Host "✓ Branch renamed to main" -ForegroundColor Green
}

Write-Host ""

# Push to GitHub
Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
Write-Host "You may be asked to authenticate." -ForegroundColor Cyan
Write-Host "Use your GitHub Personal Access Token as password." -ForegroundColor Cyan
Write-Host ""

try {
    git push -u origin main
    Write-Host ""
    Write-Host "✓ Successfully pushed to GitHub! 🎉" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your project is now on GitHub!" -ForegroundColor Green
    Write-Host "Visit your repository to see it." -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "✗ Push failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common solutions:" -ForegroundColor Yellow
    Write-Host "1. Make sure you created the repository on GitHub" -ForegroundColor White
    Write-Host "2. Use Personal Access Token instead of password" -ForegroundColor White
    Write-Host "3. Check your internet connection" -ForegroundColor White
    Write-Host ""
    Write-Host "To create a Personal Access Token:" -ForegroundColor Cyan
    Write-Host "1. Go to GitHub → Settings → Developer settings" -ForegroundColor White
    Write-Host "2. Personal access tokens → Tokens (classic)" -ForegroundColor White
    Write-Host "3. Generate new token → Select 'repo' scope" -ForegroundColor White
    Write-Host "4. Copy the token and use it as password" -ForegroundColor White
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
