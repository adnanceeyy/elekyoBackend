# Quick Deployment Script for Backend

Write-Host "🚀 Elekyo Backend Deployment Helper" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Check if Vercel CLI is installed
$vercelInstalled = Get-Command vercel -ErrorAction SilentlyContinue

if (-not $vercelInstalled) {
    Write-Host "❌ Vercel CLI not found!" -ForegroundColor Red
    Write-Host "📦 Installing Vercel CLI globally...`n" -ForegroundColor Yellow
    npm install -g vercel
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "`n❌ Failed to install Vercel CLI" -ForegroundColor Red
        Write-Host "Please run manually: npm install -g vercel" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "✅ Vercel CLI installed successfully!`n" -ForegroundColor Green
}

Write-Host "✅ Vercel CLI is ready`n" -ForegroundColor Green

# Navigate to backend directory
$backendPath = "e:\Reactjs\eleckyoBackend"
Set-Location $backendPath

Write-Host "📂 Current directory: $backendPath`n" -ForegroundColor Cyan

# Show current status
Write-Host "📋 Git Status:" -ForegroundColor Cyan
git status --short

Write-Host "`n🔐 Logging into Vercel..." -ForegroundColor Cyan
Write-Host "(A browser window will open for authentication)`n" -ForegroundColor Yellow

vercel login

if ($LASTEXITCODE -ne 0) {
    Write-Host "`n❌ Vercel login failed" -ForegroundColor Red
    exit 1
}

Write-Host "`n✅ Logged in successfully!`n" -ForegroundColor Green

Write-Host "🚀 Deploying to Vercel..." -ForegroundColor Cyan
Write-Host "(This may take a few minutes)`n" -ForegroundColor Yellow

vercel --prod

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Deployment successful! 🎉`n" -ForegroundColor Green
    Write-Host "📝 Next Steps:" -ForegroundColor Cyan
    Write-Host "1. Copy the deployment URL from above" -ForegroundColor White
    Write-Host "2. Go to Vercel Dashboard → Your Backend Project → Settings → Environment Variables" -ForegroundColor White
    Write-Host "3. Add these environment variables:" -ForegroundColor White
    Write-Host "   - MONGO_URI" -ForegroundColor Yellow
    Write-Host "   - JWT_SECRET" -ForegroundColor Yellow
    Write-Host "   - PORT (set to 5000)" -ForegroundColor Yellow
    Write-Host "   - NODE_ENV (set to production)" -ForegroundColor Yellow
    Write-Host "4. Redeploy the backend" -ForegroundColor White
    Write-Host "5. Update admin panel VITE_API_URL with your backend URL + /api`n" -ForegroundColor White
} else {
    Write-Host "`n❌ Deployment failed" -ForegroundColor Red
    Write-Host "Check the error messages above`n" -ForegroundColor Yellow
}

Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
